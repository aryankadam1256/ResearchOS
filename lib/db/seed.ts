import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── Clean existing data (order matters due to FK constraints) ──
  await db.delete(schema.notifications);
  await db.delete(schema.papers);
  await db.delete(schema.experimentLogs);
  await db.delete(schema.checkins);
  await db.delete(schema.joinRequests);
  await db.delete(schema.invitations);
  await db.delete(schema.memberships);
  await db.delete(schema.projects);
  await db.delete(schema.users);
  console.log("  Cleared existing data.");

  // ── 1. Create 5 users ──
  const passwordHash = await bcrypt.hash("ResearchOS@2026", 10);

  const [prateek, ananya, ravi, sneha, dev] = await db
    .insert(schema.users)
    .values([
      {
        name: "Prateek",
        email: "prateek@research.ai",
        passwordHash,
        bio: "Research Coordinator. Keeps the ship on course.",
      },
      {
        name: "Ananya",
        email: "ananya@research.ai",
        passwordHash,
        bio: "Lead Writer. Crafts the narrative from raw findings.",
      },
      {
        name: "Ravi",
        email: "ravi@research.ai",
        passwordHash,
        bio: "Experimenter. Runs the trials that prove or disprove hypotheses.",
      },
      {
        name: "Sneha",
        email: "sneha@research.ai",
        passwordHash,
        bio: "Literature Reviewer. Finds the papers nobody else reads.",
      },
      {
        name: "Dev",
        email: "dev@research.ai",
        passwordHash,
        bio: "Data Lead. Cleans, processes, and pipelines the data.",
      },
    ])
    .returning();
  console.log("  Created 5 users.");

  // ── 2. Create the Golden Project ──
  const [project] = await db
    .insert(schema.projects)
    .values({
      title: "Impact of LLMs on Software Engineering",
      description:
        "A multi-disciplinary investigation into how large language models are transforming software development practices, including code generation, debugging, documentation, and architectural design.",
      researchField: "Computer Science / AI",
      status: "active",
    })
    .returning();
  console.log(`  Created project: "${project.title}"`);

  // ── 3. Create 5 memberships ──
  await db.insert(schema.memberships).values([
    { userId: prateek.id, projectId: project.id, role: "admin" },
    { userId: ananya.id, projectId: project.id, role: "researcher" },
    { userId: ravi.id, projectId: project.id, role: "researcher" },
    { userId: sneha.id, projectId: project.id, role: "observer" },
    { userId: dev.id, projectId: project.id, role: "observer" },
  ]);
  console.log("  Created 5 memberships (1 admin, 2 researchers, 2 observers).");

  // ── 4. Create 10 checkins ──
  await db.insert(schema.checkins).values([
    {
      projectId: project.id,
      userId: ananya.id,
      content:
        "Drafted the Introduction and Related Work sections. Reviewed 4 papers on prompt engineering taxonomy.",
      mood: "productive",
    },
    {
      projectId: project.id,
      userId: prateek.id,
      content:
        "Coordinated meeting to align experiment evaluation metrics. Updated the project timeline.",
      mood: "productive",
    },
    {
      projectId: project.id,
      userId: sneha.id,
      content:
        "Found 6 new papers on ArXiv about instruction tuning for LLMs. Added annotations to 3 papers.",
      mood: "productive",
    },
    {
      projectId: project.id,
      userId: dev.id,
      content:
        "Preprocessed the evaluation dataset. Fixed data leakage issue in train/test split.",
      mood: "blocked",
    },
    {
      projectId: project.id,
      userId: ravi.id,
      content:
        "Ran 8 prompt variations on GPT-4. Best performing prompt achieved 78% accuracy on validation set.",
      mood: "productive",
    },
    {
      projectId: project.id,
      userId: prateek.id,
      content:
        "Reviewed grant proposal draft. Identified missing sections on ethical considerations.",
      mood: "neutral",
    },
    {
      projectId: project.id,
      userId: ananya.id,
      content:
        "Completed the Methodology section draft. Sent to Ravi for experiment alignment.",
      mood: "productive",
    },
    {
      projectId: project.id,
      userId: ravi.id,
      content:
        "Compared Claude 3.5 vs GPT-4 on math reasoning. Claude outperforms by 4%.",
      mood: "productive",
    },
    {
      projectId: project.id,
      userId: dev.id,
      content:
        "Set up evaluation pipeline. Automated metrics collection across all experiment runs.",
      mood: "productive",
    },
    {
      projectId: project.id,
      userId: sneha.id,
      content:
        "Highlighted conflicting findings between two prominent studies on LLM calibration.",
      mood: "neutral",
    },
  ]);
  console.log("  Created 10 checkins.");

  // ── 5. Create 5 experiment logs ──
  await db.insert(schema.experimentLogs).values([
    {
      projectId: project.id,
      userId: ravi.id,
      title: "Prompt Engineering for Math Reasoning",
      hypothesis:
        "Structured prompts with persona framing improve accuracy on GSM8K.",
      methodology:
        "Test 8 prompt templates across GPT-4 and Claude 3.5 Sonnet.",
      results: "Best prompt: persona+step-by-step, 82% accuracy.",
      status: "completed",
    },
    {
      projectId: project.id,
      userId: dev.id,
      title: "LoRA Fine-tuning Llama 3 on Domain Data",
      hypothesis:
        "Higher LoRA rank improves domain adaptation at cost of compute.",
      methodology:
        "Compare rank 16, 32, 64 with learning rates 1e-4 to 5e-4.",
      results: "Rank 64 + lr 1e-4 optimal. 76% eval accuracy.",
      status: "completed",
    },
    {
      projectId: project.id,
      userId: ravi.id,
      title: "Few-Shot vs Zero-Shot Code Generation",
      hypothesis:
        "3-shot examples outperform zero-shot for complex coding tasks.",
      methodology:
        "Evaluate on HumanEval with 0, 1, 3, 5 shot examples.",
      status: "running",
    },
    {
      projectId: project.id,
      userId: dev.id,
      title: "Token Budget Optimization",
      hypothesis:
        "Shorter prompts with higher information density maintain quality.",
      methodology:
        "Progressively compress prompts and measure output quality.",
      status: "planned",
    },
    {
      projectId: project.id,
      userId: ananya.id,
      title: "Cross-lingual Transfer in Code LLMs",
      hypothesis:
        "Models trained primarily on English code generalize to other programming languages.",
      methodology: "Test on MultiPL-E benchmark across 10 languages.",
      status: "planned",
    },
  ]);
  console.log("  Created 5 experiment logs.");

  // ── 6. Create 5 papers ──
  await db.insert(schema.papers).values([
    {
      projectId: project.id,
      uploadedBy: sneha.id,
      title:
        "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
      authors: ["Jason Wei", "Xuezhi Wang", "Dale Schuurmans"],
      abstract:
        "We explore how generating a chain of thought significantly improves the ability of LLMs to perform complex reasoning.",
      tags: ["prompting", "reasoning", "chain-of-thought"],
    },
    {
      projectId: project.id,
      uploadedBy: ananya.id,
      title: "Constitutional AI: Harmlessness from AI Feedback",
      authors: ["Yuntao Bai", "Saurav Kadavath"],
      abstract:
        "We experiment with methods for training a harmless AI assistant through constitutional AI.",
      tags: ["alignment", "RLHF", "safety"],
    },
    {
      projectId: project.id,
      uploadedBy: ravi.id,
      title: "Direct Preference Optimization",
      authors: ["Rafael Rafailov", "Archit Sharma"],
      abstract:
        "DPO implicitly optimizes the same objective as RLHF but is simpler to implement.",
      tags: ["DPO", "RLHF", "alignment"],
    },
    {
      projectId: project.id,
      uploadedBy: dev.id,
      title: "LoRA: Low-Rank Adaptation of Large Language Models",
      authors: ["Edward J. Hu", "Yelong Shen"],
      abstract:
        "LoRA freezes pre-trained weights and injects trainable rank decomposition matrices.",
      tags: ["fine-tuning", "efficiency", "LoRA"],
    },
    {
      projectId: project.id,
      uploadedBy: sneha.id,
      title: "Scaling Data-Constrained Language Models",
      authors: ["Niklas Muennighoff", "Alexander Rush"],
      abstract:
        "We investigate scaling language models in data-constrained regimes.",
      tags: ["scaling", "data", "training"],
    },
  ]);
  console.log("  Created 5 papers.");

  // ── 7. Create sample notifications ──
  await db.insert(schema.notifications).values([
    {
      userId: sneha.id,
      type: "invite",
      title: "Welcome to the Project",
      message:
        "You have been added to 'Impact of LLMs on Software Engineering' as an Observer.",
      link: `/dashboard/${project.id}`,
      metadata: { projectId: project.id },
    },
    {
      userId: dev.id,
      type: "general",
      title: "Pipeline Update",
      message:
        "The evaluation pipeline has been updated. Please review the new metrics configuration.",
      link: `/dashboard/${project.id}/experiments`,
      metadata: { projectId: project.id },
    },
  ]);
  console.log("  Created 2 notifications.");

  // ── Done ──
  console.log("\n✅ Seed complete!");
  console.log(`  Project ID: ${project.id}`);
  console.log(
    `  Users: ${[prateek, ananya, ravi, sneha, dev].map((u) => u.email).join(", ")}`
  );
  console.log("  Password: ResearchOS@2026 (for all users)");

  await client.end();
}

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
