import { Request, Response } from "express";
import { makeSlug } from '../utils/slug';
const { sequelize, Poll, PollOption, Vote } = require("../db"); // JS import

export async function createPoll(req: Request, res: Response) {
  
  const { title, creatorUsername, options } = req.body;
  if (!title || !creatorUsername) {
    return res
      .status(400)
      .json({ error: "title and creatorUsername required" });
  }
  if (!Array.isArray(options) || options.length < 2 || options.length > 8) {
    return res
      .status(400)
      .json({ error: "options must be an array of 2..8 strings" });
  }

  try {
    const slug = makeSlug(10);
    const poll = await sequelize.transaction(async (t: any) => {
      const p = await Poll.create(
        { slug, title, creator_username: creatorUsername },
        { transaction: t }
      );

      await PollOption.bulkCreate(
        options.map((label: string, i: number) => ({
          poll_id: p.id,
          label,
          position: i + 1,
        })),
        { transaction: t }
      );
      return p;
    });

    res.status(201).json({ slug: poll.slug });
  } catch (e: any) {
    if (e?.parent?.code === "ER_DUP_ENTRY") {
      // extremely rare slug collision — try again longer if you want
      return res.status(409).json({ error: "Slug collision, try again" });
    }
    console.error(e);
    res.status(400).json({ error: "Failed to create poll" });
  }
}

export async function getPoll(req: Request, res: Response) {
  const { slug } = req.params;

  const poll = await Poll.findOne({
    where: { slug },
    include: [{ model: PollOption, as: "options" }],
  });

  if (!poll) return res.status(404).json({ error: "Not found" });

  // counts + percentages
  const [rows] = await sequelize.query(
    `SELECT po.id AS option_id, po.label, po.position, COUNT(v.id) AS votes
     FROM poll_options po
     LEFT JOIN votes v ON v.option_id = po.id
     WHERE po.poll_id = ?
     GROUP BY po.id
     ORDER BY po.position ASC`,
    { replacements: [poll.id] }
  );

  const total = (rows as any[]).reduce((s, r) => s + Number(r.votes), 0);
  const options = (rows as any[]).map((r) => ({
    optionId: Number(r.option_id),
    label: r.label,
    position: Number(r.position),
    votes: Number(r.votes),
    percent: total ? Math.round((Number(r.votes) * 10000) / total) / 100 : 0,
  }));

  res.json({
    poll: {
      slug: poll.slug,
      title: poll.title,
      creatorUsername: poll.creator_username,
    },
    totalVotes: total,
    options,
  });
}

export async function castVote(req: Request, res: Response) {
  const { slug } = req.params;
  const { voterUsername, optionId } = req.body; 

  if (!voterUsername || !optionId) {
    return res
      .status(400)
      .json({ error: "voterUsername and optionId required" });
  }

  try {
    await sequelize.transaction(async (t: any) => {
      const poll = await Poll.findOne({
        where: { slug },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!poll) throw new Error("Poll not found");

      const option = await PollOption.findOne({
        where: { id: optionId, poll_id: poll.id },
        transaction: t,
      });
      if (!option) throw new Error("Invalid option for this poll");

      await Vote.create(
        {
          poll_id: poll.id,
          option_id: optionId,
          voter_username: voterUsername,
        },
        { transaction: t }
      );
    });

    res.status(201).json({ ok: true });
  } catch (e: any) {
    if (e?.parent?.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "This username already voted in this poll" });
    }
    console.error(e);
    res.status(400).json({ error: e.message || "Vote failed" });
  }
}
