---
title: Lucid board asset package
description: Every item, its literal board text, and its image assets, ready to lay onto the Lucid board without going back to source.
updated: 2026-08-24
---

# Lucid board asset package

This is the build sheet for the Scribl Lucid board. It carries five sections. For each item it
gives what the item is, the source path behind it, the literal text that goes on the board, the
shape and rough size, and whether it is client-visible.

Rules for whoever lays this down.

- The text in the "Board text" blocks is final. Do not rewrite it, do not summarise it, do not
  add prose of your own. Exception: any sticky marked INTERNAL / cut before sharing is not
  board text at all. Do not lay it down. It stays off the board even though it sits inside the
  same fenced block.
- Nothing on the board should need a source doc to defend it. Every item carries its path.
- Check the client-visible flag on every item before the board is shared. Several items are
  Bounteous-internal and named as such.
- Images live in `product/design/lucid-board/screens/` and are already named in walk order.

## Board layout

Five bands, left to right, in the order a room reads them.

| Band | Section | Section owner |
|---|---|---|
| 1 | AWS architecture, the designed target, a lighter variant, the current build, the gaps between them, and traceability | This package |
| 2 | What the screens look like | This package |
| 3 | Open questions with owners | This package |
| 4 | Capacity, who is on what | This package |
| 5 | Epic timeline, the client cards against their delivery week | Landed 2026-08-24, see below |

## Section 5 -- epic timeline. Landed 2026-08-24, half of it.

The reserved band is no longer empty. The epic timeline went down on 2026-08-24 as an additive
band, 2400 wide by 1400 tall, and the re-cut sprint 1 that was to sit beside it did not.

What went down. One frame titled "5 -- EPIC TIMELINE. WHERE EACH OF YOUR CARDS LANDS", holding
every card from the client's own three prioritization bands against the delivery week it lands in.
Five columns, one per demo Wednesday plus one for the cards with no week inside the eight weeks.
Card fills reuse the client's own band colours so the two sections read as one board. A burn-up
strip runs along the bottom, because reporting here is a burn-up and no artifact on this board
should imply a burn-down.

Where it came from. `tracking/client-priority-to-delivery-week.md` is the source of record for the
mapping, and every delivery week on the band traces to a milestone statement in
`tracking/timeline-and-milestones.md`. Card ordering was read off the live board rather than out of
this repo, because the repo holds no export of the board and records band membership only.

What is still missing. The re-cut sprint 1 with its single cut line across all four lanes, item 2
of `tracking/board-selection.md`. The 2400 by 1400 reservation is full with the timeline, and the
cut line is a different artifact that reads badly squeezed in beside it. It needs its own space on
the board, and that is a placement decision rather than an authoring one.

Where it sits. To the right of frame 6, origin x 12217, y 25415, top edge aligned with frames 1
and 2. Numbering on the board now runs 1, 2, 3, 6, 5, which is wrong in the reading order and was
accepted deliberately. The only gap between frames 3 and 6 is 288 wide, and closing it would have
meant moving frame 6, which no additive change is allowed to do.

A PNG of the band is committed at `product/design/lucid-board/screens/band-5-epic-timeline.png`.

One more thing the next person needs. This package names five bands. The live board carries frames
numbered 1, 2, 3 and 6. Band 4, capacity, is not on the board at all, and frame 6, meetings to set
up, is not in this package. So the numbering here and the numbering on the board had already
diverged before band 5 landed, and reconciling them means moving existing frames, which is why it
was not done.

## Section 1 -- AWS architecture


The designed three-region architecture is the subject of this band. It goes up as item 1.1, at
full size, with the rendered diagram as its asset, and the board asks the room a question about
it rather than presenting it as settled.

Seven items go up beside it, because the designed architecture cannot be read honestly on its
own. Item 1.2 is a lighter version of the same design for dev and stage, authored here for the
first time. Item 1.3 is the shape the eight-week build actually deploys, API Gateway plus Lambda
plus Fargate plus Aurora Serverless v2 rather than EKS and Bedrock. Items 1.4 through 1.6 carry
the gaps. There is no migration path between the two shapes, no ADR for auth, and all 11 ADRs
are still Proposed. Item 1.7 is the traceability map, one row per component. Item 1.8 lists
where the diagram and the cost model disagree.

Lay the band out in that order. Target first, then the lightened copy, then the current build,
then the gaps. Do not push the gaps to the far edge where a room stops reading.

### Item 1.1 -- The designed architecture (three-region D2C), and the decision on it

- **What it is:** The designed production architecture. Three full regional stacks behind a
  global edge, EKS for application compute, Amazon Bedrock for Claude inference, Cognito user
  pools per region. This is the only architecture in the project with a rendered diagram.
- **Source:** docs/public/assets/context/scribl-aws-architecture-d2c.png,
  docs/context/media/scribl-aws-architecture-d2c.md,
  knowledge/research/scribl-poc-aws-architecture.md,
  docs/context/data/scribl-d2c-aws-estimate-v3.md
- **Shape and size:** image, approx 2000 x 1900, laid out as the largest single item on the
  board, with a caption block and a 4-number headline strip beneath it, approx 2000 x 300 for
  the text. There is no editable source file for this image, so it goes on the board as the PNG.
- **Client-visible:** Yes
- **Board text:**

```
Title: The designed architecture -- three regions, EKS, Bedrock
Image: docs/public/assets/context/scribl-aws-architecture-d2c.png

Caption:
Route 53 fronts the request path and AWS WAF inspects requests in front of
CloudFront. The diagram's own note attributes the latency routing to
CloudFront rather than to Route 53; item 1.8 carries that as an open
question, because it decides which service holds the routing policy. Three regional stacks: us-east-2 (Ohio,
primary, Americas), eu-west-2 (London), ap-southeast-1 (Singapore). Each
region runs its own EKS cluster, Cognito user pool, Aurora Serverless v2 and
S3. In the primary region the Application Load Balancer fronts EKS, EKS calls
Amazon Bedrock for Claude, and DynamoDB, ElastiCache, OpenSearch and S3 media
sit alongside. EventBridge to SQS drives the daily prompt. SNS to Pinpoint
drives push. An observability band adds Managed Prometheus and Managed
Grafana over CloudWatch. An analytics band adds an S3 data lake with Glue,
Athena and SageMaker. The diagram's own note says us-east-2 also hosts dev
and stage plus the central de-identified analytics lake.

Run rate (30-month model, Oct 2026 to Mar 2029, Ohio list prices, no partner
discount):
- Run rate at launch (month 1): approx $9,107 / mo
- Run rate at scale (month 30): approx $182,633 / mo
```

- **Second board text block, the decision card.** Place it directly under the diagram, not off
  to one side. Sticky cluster, 1 header sticky plus 3 body stickies, approx 700 x 450.
  Client-visible: Yes.

```
Header sticky: THE DECISION IN THIS ROOM

Question 1:
Is this the architecture we are building toward? A yes commits the product to
EKS, Bedrock and per-region Cognito, at list price with no partner discount,
under one set of usage growth assumptions still being worked through. Cost
is not settled here; that work happens separately.

Question 2:
If yes, what does the eight-week build deploy so that it is a step toward
this rather than something thrown away? The eight weeks as planned and costed
is API Gateway plus Lambda plus Fargate plus Aurora Serverless v2 (item 1.3),
which is a different compute and inference path, and no document connects the
two (item 1.4).

What the board is not asking:
It is not asking the room to approve the diagram as drawn. Eighteen of its
components have no ADR behind them, only a research note (item 1.7), and all
11 ADRs that do exist are still Proposed (item 1.6).
```

### Item 1.2 -- The lighter variant for dev and stage

- **What it is:** The same design with components taken out, specified for the two lower
  environments. It describes dev and stage once the EKS build starts, not during the eight
  weeks. In the eight weeks, E01-F1 stands up dev, stage and prod on the item 1.3 shape. The
  cost model already sizes non-prod at 0.5 of the prod baseline, with observability at 0.2 and
  Aurora idling at 1 ACU, so a lightened lower environment is not a new idea. What did not exist
  before is a component-by-component statement of which boxes come out. A reduced version of the
  same design, rather than a second design, is what keeps anything from being re-platformed on
  the way up.
- **Source:** authored here, from
  docs/public/assets/context/scribl-aws-architecture-d2c.png,
  docs/context/data/scribl-d2c-aws-estimate-v3.md,
  tracking/backlog-epics.md (E01-F8, E08-F3, E09-F1)
- **Shape and size:** frame, node-and-edge diagram drawn from the component list below, approx
  1600 x 1100, plus the removal table beneath it, approx 1600 x 900. Use the same AWS service
  icons, the same colours and the same left-to-right request flow as item 1.1, so the two read
  as a pair rather than as two diagrams.
- **Client-visible:** Yes
- **Board text:**

```
Title: The same design, lightened, for dev and stage
Subtitle: One region. Two environments. Nothing that has to be re-platformed
on the way to production.

When this applies: from the start of the EKS build, not during the eight
weeks. During the eight weeks, dev, stage and prod all run the item 1.3
shape under E01-F1. This variant is what dev and stage become once EKS
exists.

Both environments live in us-east-2, which the designed architecture already
names as the host for dev and stage.

The cost model already runs dev and stage at 0.5 of the prod baseline, with
observability at 0.2 and Aurora idle at 1 ACU. The removals below go further
than that and say which boxes are gone rather than which are half-sized.

Edge and ingress
- Route 53, hosted zone only, one record per environment. No latency routing,
  because with one region there is nothing to route between.
- CloudFront, kept. Media reads are signed URLs and that path has to be
  exercised somewhere before production.
- Application Load Balancer, one per environment.

Application and identity
- EKS, one cluster per environment, smallest supported node group.
- Cognito, one user pool per environment.
- Amazon Bedrock, kept in both. Haiku and Sonnet in dev, plus Opus in stage
  for daily prompt generation.

Data
- Aurora Serverless v2, minimum capacity, one cluster per environment.
- S3 media, one bucket per environment, short lifecycle expiry.

Async
- EventBridge to SQS, kept in both. This is the daily-prompt trigger and the
  submit-does-not-block-on-AI path.
- SNS to Pinpoint, stage only.

Observability
- CloudWatch only, in both. Structured logs, one dashboard per environment,
  alarms on API error rate and function failures.

Request flow, same order as the production diagram
- Client -> Route 53 -> CloudFront -> Application Load Balancer -> EKS
- EKS -> Amazon Bedrock -> Claude
- EKS -> Aurora Serverless v2 (read and write)
- EKS -> S3 media (presigned PUT on submit, signed GET on read)
- EventBridge -> SQS -> EKS (daily prompt)
- EKS -> SNS -> Pinpoint (stage only)
- Everything -> CloudWatch
```

- **Second board text block, the removal table.** This is the part the room will argue with, so
  put it on the board rather than in a handout. Table, 3 cols x 12 rows (1 header plus 11
  removals), approx 1600 x 900, directly beneath the lighter diagram. Client-visible: Yes.

```
Title: What comes out, why, and what that makes untestable

| Removed | Why | What it makes untestable |
| eu-west-2 and ap-southeast-1 stacks | Two more regions cost money to prove a routing behaviour a single region cannot exhibit. Nothing in the backlog is multi-region. | Cross-region data residency, per-region Cognito pools, and any regional failover behaviour. First exercise is the London build itself, around month 13. |
| Route 53 latency routing policy | One region, nothing to route between. The hosted zone stays. | The routing policy itself, and any assumption about which region a client resolves to. |
| AWS WAF | Priced at $77 / mo at launch across environments and rising to $1,493 by month 30. No backlog feature configures a rule. Recommend standing one WAF up in stage before launch, not in dev. | Rate limiting, bot rules, and the 403 a blocked client actually sees, in dev. If the stage recommendation is taken, stage covers all of it before launch. If it is not, a WAF first enabled in production is a WAF whose false positives are discovered by real users. |
| DynamoDB | ADR-0004 keeps it as the forward-scale option and no feature depends on it now. Access patterns stay portable per E01-F3. | Nothing today. It becomes untestable the moment a feature reaches for it, which is the trigger to put it back. |
| ElastiCache (Redis) | $1,300 / mo flat in the model. No backlog feature reads or writes a cache. | Cache invalidation on write, and any latency number that assumes a warm cache. |
| OpenSearch | $1,300 / mo flat in the model. No search feature exists and log analytics falls to CloudWatch Logs Insights. | Search relevance and query shape. |
| Managed Prometheus and Managed Grafana | E01-F8 is deliberately the CloudWatch-only floor for this phase, and no ADR covers phase observability. | Dashboard and alert parity with production. Production alerting rules get their first real exercise in production, which is the sharpest edge on this list. |
| S3 data lake, Glue, SageMaker, research egress | Research capability, not application runtime. The cost model starts this band at month 13, after this phase ends. | The de-identification job and the curated dataset shape. No application code path depends on either. |
| Athena | Same band. Conditional: E08-F3 queries a partitioned S3 event store through Athena, so wherever E08-F3 has landed, the events bucket and Athena come back into dev. | The event schema and the partition layout, which is exactly what E08-F3 exists to prove. Do not remove this one without checking whether E08 has shipped. |
| SNS and Pinpoint in dev | Push delivery needs real devices and real tokens; stage is where that lives. E09-F1 is orange band. | Device-token storage and delivery in dev only. Stage keeps the full path. |
| Opus, in dev | ADR-0011 puts Opus on daily prompt generation only, at $5.32 / mo flat in the model, and the lighter variant keeps the whole daily-prompt path. Dev runs it on Sonnet. Stage runs Opus, because the prompt a user reads is generated there. | The prompt text Opus actually produces, in dev. A prompt-quality judgement made against dev output is a judgement about Sonnet. |

Note, not a removal:
Reserved and standby capacity, $1,300 / mo, is prod-only in the model for
launch readiness and disaster recovery. It was never in a lower environment,
so there is nothing to remove. Failover and restore drills stay a stage and
production exercise.

Caveat on the dollar figures:
ElastiCache, OpenSearch, the platform baseline and the observability line are
each charged across all three environments together in the cost model, at 0.5
weight for each non-prod environment. Removing the dev and stage instances
saves a share of those lines, not the whole figure quoted.

Sticky:
Three removals leave a code path nobody exercises before production: the
observability stack, ElastiCache, and Athena if E08 lands. WAF joins them if
the stage recommendation is not taken. The observability one is the sharpest,
because production alerting rules would get their first real exercise in
production.
```

### Item 1.3 -- What the eight-week build actually deploys

- **What it is:** The AWS shape the current phase is planned and costed against: serverless
  request path, a separate Fargate AI service, Aurora Serverless v2 as system of record, and an
  async queue so AI never blocks submit. It is not a lightened version of item 1.1. It is a
  different compute and inference path.
- **Source:** product/inputs/reference/decisions/0002-serverless-first-backend.md,
  product/inputs/reference/decisions/0003-ai-pipeline-separate-service.md,
  product/inputs/reference/decisions/0010-async-ai-pipeline.md,
  product/inputs/reference/decisions/README.md
- **Shape and size:** frame, node-and-edge diagram, approx 1600 x 900. No source PNG exists for
  this architecture; draw it from the node and arrow list below. Place it to the right of item
  1.1, at visibly smaller scale, so the board reads target first and current build second.
- **Client-visible:** Yes
- **Board text:**

```
Title: What the eight weeks deploys -- Lambda and Fargate, not EKS
Subtitle: All 11 backing ADRs are Proposed, none Accepted

Nodes:
- Mobile client (React Native)
- API Gateway
- Lambda (Node/TypeScript) -- request/response API
- ECS Fargate -- Claude AI service (Python)
- Aurora Serverless v2 (PostgreSQL) -- system of record
- Amazon S3 (media) -- artwork and thumbnails
- CloudFront -- signed URLs on read
- Cognito -- user pool, recommended, no ADR (item 1.5)
- SQS -- async queue
- EventBridge -- async trigger
- Claude (Direct API, provider abstraction)

Arrows:
- Mobile client -> API Gateway
- API Gateway -> Lambda
- Lambda -> Aurora Serverless v2 (read/write, request path)
- Lambda -> EventBridge (on submit, fire and forget)
- EventBridge -> SQS
- SQS -> ECS Fargate (Claude AI service)
- ECS Fargate -> Claude (Direct API)
- ECS Fargate -> Aurora Serverless v2 (write back the AI result)
- Lambda -> Amazon S3 (media) (issues a presigned PUT on submit)
- Mobile client -> CloudFront -> Amazon S3 (media) (signed GET on read)
- Mobile client -> Cognito (sign-in), Lambda reads the identity it issues

Caption:
Submit never blocks on AI. The user submits and unlocks immediately through
Lambda; the Claude reflection and moderation run async off the SQS queue and
update the record after the fact.

Sticky, cost shape:
Lambda autoscales to the daily prompt spike and costs near zero overnight.
The AI service stays a persistent Fargate service for connection reuse and
prompt-cache warmth, which per-request Lambdas do not give it.

Sticky, IaC:
All infrastructure as AWS CDK (TypeScript).

Sticky, what carries over:
Aurora Serverless v2, S3 media, CloudFront, Cognito, EventBridge, SQS and CDK
appear in both shapes. API Gateway, Lambda, Fargate and the Claude Direct API
do not appear in the designed architecture at all. EKS, Bedrock, ElastiCache
and OpenSearch do not appear in this one. Cognito is planned for the eight
weeks and drawn in the design, and has an ADR in neither (item 1.5).
```

### Item 1.4 -- Gap: no migration path between the two shapes

- **What it is:** A named gap card. Nothing in the repo describes how the eight-week serverless
  build (item 1.3) becomes the designed EKS architecture (item 1.1), and no ADR owns that
  transition.
- **Source:** the backlog review dated 2026-08-20, held outside this repo,
  product/inputs/reference/decisions/README.md,
  tracking/backlog-epics.md ("Risks", which states the same gap in the backlog's own words)
- **Shape and size:** sticky cluster, 1 header sticky plus 3 body stickies, approx 500 x 400.
  Place it between items 1.1 and 1.3, on the line the two items would otherwise imply.
- **Client-visible:** Yes
- **Board text:**

```
Header sticky: GAP -- no migration path, no ADR

Body sticky 1:
Lambda + Fargate + Aurora in the eight weeks. EKS + Bedrock + Cognito +
multi-region in the design. No document in the project says how one becomes
the other.

Body sticky 2:
A documented review on 2026-08-20 checked for a migration ADR or plan and
found none. The backlog says the same thing in its own Risks section. This is
a confirmed gap, not an open question awaiting an answer somewhere else.

Body sticky 3:
Call: this card sits between the two architecture items, not folded into
either. Question 2 on the decision card is this gap restated as something the
room can answer.
```

### Item 1.5 -- Gap: auth has no ADR

- **What it is:** A named gap card. Eleven ADRs back the architecture; none of them covers
  authentication or identity, even though the backlog recommends Cognito and the designed
  architecture puts a Cognito user pool in every region.
- **Source:** product/inputs/reference/decisions/README.md,
  knowledge/research/scribl-poc-aws-architecture.md (Cognito appears in the research note only),
  the backlog review dated 2026-08-20 (held outside this repo)
- **Shape and size:** sticky cluster, 1 header sticky plus 3 body stickies, approx 500 x 400.
- **Client-visible:** Yes. The board text already reads without a backlog ID or an engineer's
  name. Band rule, applied to items 1.2, 1.5 and 1.7 alike: feature IDs are client-safe and
  stay, individual engineers' names are not and do not appear in this band.
- **Board text:**

```
Header sticky: GAP -- auth has no ADR

Body sticky 1:
The backend feature that issues sign-in tokens recommends a Cognito user
pool, email and password only, no Apple or Google sign-in. No ADR covers
this choice anywhere in the architecture decision set.

Body sticky 2:
Cognito is drawn in all three regions of the designed architecture and named
in one research note. Neither is a decision record. The eight-week build is
about to depend on Cognito without one.

Body sticky 3:
Call: every authorization check downstream reads the identity this feature
issues. Write the ADR before build lock, not after. Confirmed as an open
gap by a documented review on 2026-08-20.
```

### Item 1.6 -- ADR status table

- **What it is:** A status check across the 11 architecture ADRs. Verified against the ADR
  index and against each ADR file. Every one reads Proposed, none reads Accepted.
- **Source:** product/inputs/reference/decisions/README.md and the 11 ADR files beside it
- **Shape and size:** table, 3 cols x 12 rows (1 header + 11 ADRs), approx 900 x 500.
- **Client-visible:** Yes
- **Board text:**

```
Title: ADR status -- all 11 Proposed, none Accepted

| ADR | Decision | Status |
| 0001 | React Native primary; native modules only where required | Proposed |
| 0002 | Serverless-first backend; Fargate for the AI pipeline | Proposed |
| 0003 | AI pipeline is a separate service, not inline in Lambdas | Proposed |
| 0004 | Aurora Serverless v2 (PostgreSQL) as system of record | Proposed |
| 0005 | AWS CDK (TypeScript) for all infrastructure | Proposed |
| 0006 | Drawing canvas via React Native Skia; voice on-device | Proposed |
| 0007 | Submit-to-unlock enforced at the data/API layer | Proposed |
| 0008 | Analytics on a separate Kinesis to S3 to Athena pipeline | Proposed, under review |
| 0009 | Provider-abstraction layer for Claude (Direct API default) | Proposed |
| 0010 | Drawing interpretation and moderation run async | Proposed |
| 0011 | Model tiering: Opus / Sonnet / Haiku | Proposed |

Sticky, on 0008:
Its status line reads "Proposed, under review (2026-06-10)". A recommendation
proposes leading with a product-analytics SDK (PostHog) and deferring the
bespoke warehouse. So 0008 has a live alternative on the table, not just an
unconfirmed decision.

Sticky:
None of these are Accepted yet. Each becomes Accepted once David Lawton and
Rob Forshier II confirm it (and, where noted in the ADR, once Matt Kaplan or
the AWS conversation confirms it too).

Sticky, coverage:
These 11 cover the eight-week build's compute, data, AI and IaC choices. They
do not cover the designed architecture's edge, identity, cache, search,
messaging or observability. Item 1.7 marks each of those rows.
```

### Item 1.7 -- Traceability map, component by component

- **What it is:** One row per component in the designed architecture, with where it is specified,
  which backlog features depend on it, what the cost model charges for it, and whether the
  lighter variant keeps it. This is the row a person reads before removing a component.
- **Source:** knowledge/research/scribl-poc-aws-architecture.md (lines 22 to 37, the component
  list), product/inputs/reference/decisions/ (11 ADRs; 0005-aws-cdk-iac.md is the anchor for how
  components become CDK stacks), tracking/backlog-epics.md,
  docs/context/data/scribl-d2c-aws-estimate-v3.md
- **Shape and size:** table, 5 cols x 28 rows (1 header plus 27 components), approx 2600 x 1400. This is a reference table, not
  a discussion item. Put it below the diagrams at the bottom of the band.
- **Client-visible:** Yes with a caveat printed on the item itself (cost figures are Ohio list
  prices with no partner discount, month 1 and month 30 of the 30-month model, and four lines
  are charged across all environments together rather than per environment; without that line
  the numbers read as per-service precision they do not have).
- **Board text:**

```
Title: Every component, where it is specified, who depends on it, what it costs
Subtitle: Cost is $/mo at month 1 and month 30, Ohio list price, no partner
discount. "no cost line" means the component is drawn but not priced.

| Component | Where it is specified | Backlog features that depend on it | Cost, M1 / M30 | In the lighter variant |
| Route 53 | Research note, "Request path and tiers". No ADR | none | no cost line | Hosted zone yes, latency routing no |
| AWS WAF | Research note, "Request path and tiers". No ADR | none | 77 / 1,493 | No, stage only before launch |
| CloudFront | Research note, "Request path and tiers". No ADR | E01-F6 (signed URLs on read) | folded into Data transfer out, 20 / 13,113 | Yes |
| Application Load Balancer | Research note, "Regional ingress". No ADR | none | 99 / 164, plus LCU 0.36 / 239 | Yes, one per environment |
| Amazon EKS | Research note, "Application tier". No ADR | none this phase; E01 states no part of the EKS design is in scope | control plane 219 / 365, workers 841 / 5,043 | Yes, one cluster per environment |
| Amazon Cognito | Research note, "Auth". No ADR. This is the auth gap in item 1.5 | E02-F1, and E02-F2 downstream of it | 0 / 8,478 | Yes, one pool per environment |
| Amazon Bedrock | Research note, "EKS to Bedrock to Claude". ADR-0009 names Bedrock as an adapter, not the default | none by name; E03, E04 and E10 depend on Claude through ADR-0003, 0010 and 0011 | 217 / 132,340 across all three model tiers | Yes |
| Claude model tiering | ADR-0011 | E03 (prompt generation), E04 (drawing read), E10 (moderation) | see Bedrock; Opus is 5.32 / 5.32 flat | Haiku and Sonnet in both, Opus in stage only |
| Aurora Serverless v2 | ADR-0004, and research note "Data tier" | E01-F3, E04-F4 | compute 1,051 / 4,761, storage 0.40 / 262 | Yes, minimum capacity |
| Amazon DynamoDB | ADR-0004, as the forward-scale option | none this phase; E01-F3 keeps access patterns portable | 1.42 / 930 across reads, writes and storage | No |
| ElastiCache (Redis) | Research note, "Data tier". No ADR | none | 1,300 / 1,300, flat, all environments together | No |
| OpenSearch | Research note, "Data tier". No ADR | none | 1,300 / 1,300, flat, all environments together | No |
| Amazon S3 (media) | Research note, "Data tier". No ADR | E01-F6, E04-F4 | storage 0.22 / 1,838, requests 0.82 / 537 | Yes |
| EventBridge | Research note, "Async lane". No ADR | E01-F2 names an events stack; no feature names EventBridge | no cost line | Yes |
| Amazon SQS | ADR-0010, and ADR-0003 | E10-F1 | no cost line | Yes |
| Amazon SNS | Research note, "Async lane". No ADR | E09-F1 | no cost line | Stage yes, dev no |
| Amazon Pinpoint | Research note, "Async lane". No ADR | E09-F1 | no cost line | Stage yes, dev no |
| Amazon CloudWatch | Research note, "Observability". No ADR | E01-F8 | bundled with Prometheus, Grafana and X-Ray, 783 / 2,672, all environments | Yes, and it is the whole observability story |
| Amazon Managed Prometheus | Research note, "Observability". No ADR | none; E01-F8 excludes it by name | in the bundled observability line above | No |
| Amazon Managed Grafana | Research note, "Observability". No ADR | none; E01-F8 excludes it by name | in the bundled observability line above | No |
| S3 data lake | Research note, "Analytics/ML". No ADR. ADR-0008 specifies a different pipeline | none. E08-F3 writes its own partitioned S3 event store and excludes the Glue and SageMaker lake by name | 0 / 120, starts month 13 | No |
| AWS Glue | Research note, "Analytics/ML". No ADR | none; E08-F3 excludes it by name | 0 / 453, starts month 13 | No |
| Amazon Athena | Research note, "Analytics/ML", and ADR-0008 | E08-F3, over its own event store rather than over this lake | 0 / 140, starts month 13 | No, unless E08-F3 lands this phase |
| Amazon SageMaker | Research note, "Analytics/ML". No ADR | none | notebooks 0 / 2,450, training 0 / 1,277, starts month 13 | No |
| AWS CDK (all of the above) | ADR-0005 | E01-F2, and every AWS feature in E01, E09 and E08 transitively | inside the platform baseline, 1,700 / 1,700 flat | Yes |
| AWS X-Ray | Research note, "Observability". No ADR | none | inside the bundled observability line | No. It is priced but not drawn, see item 1.8 |
| Kinesis Data Firehose | ADR-0008 | E08-F3 names Firehose | no cost line | No. Note it is in no diagram either, see item 1.8 |

Sticky:
Eighteen components have no ADR and rest on one research note. Route 53, WAF,
CloudFront, ALB, EKS, Cognito, ElastiCache, OpenSearch, S3 media,
EventBridge, SNS and Pinpoint, plus the whole observability band (CloudWatch,
Managed Prometheus, Managed Grafana) and three of the analytics band (S3 data
lake, Glue, SageMaker). Auth is the gap already named. It is not the only
one, and EKS having no ADR is the largest of them.
```

### Item 1.8 -- Where the diagram and the cost model disagree

- **What it is:** A findings card. The designed diagram and the 30-month cost model do not cover
  the same set of components in either direction. Neither document is wrong on its own; they
  have never been reconciled against each other.
- **Source:** docs/public/assets/context/scribl-aws-architecture-d2c.png,
  docs/context/data/scribl-d2c-aws-estimate-v3.md,
  product/inputs/reference/decisions/0008-analytics-separate-pipeline.md
- **Shape and size:** sticky cluster, 1 header sticky plus 5 body stickies, approx 700 x 550.
- **Client-visible:** Yes with redaction (cut body sticky 5, the internal note on unverified
  AWS spend, before the board is shared).
- **Board text:**

```
Header sticky: FINDINGS -- diagram and cost model do not line up

Body sticky 1, drawn but not priced:
Route 53, EventBridge, SQS, SNS and Pinpoint each appear in the diagram and
have no line in the cost model. The model does not say whether they are
assumed negligible or simply missed. At production volume, SQS and Pinpoint
are not obviously negligible.

Body sticky 2, priced but not drawn:
Three model lines have no box in the diagram. The platform and management
baseline at $1,700 / mo flat, which the assumptions sheet says covers ECR,
Secrets Manager, KMS, CI runners and a bastion. Reserved and standby capacity
at $1,300 / mo flat. NAT gateways at $197 / mo rising to $329. Together that
is $3,197 / mo at launch, a third of the month 1 run rate, spent on things
the architecture does not show.

Body sticky 3, three analytics answers:
ADR-0008 specifies Kinesis Firehose to S3 to Athena. The diagram draws S3 to
Glue to Athena with SageMaker and no Kinesis. ADR-0008's own status line
proposes a third answer, a product-analytics SDK (PostHog) instead of the
bespoke warehouse. E08-F3 follows the ADR and names Firehose. Kinesis appears
in neither the diagram nor the cost model. Nothing reconciles the three.

Body sticky 4, folded lines:
CloudFront has no line of its own; its cost sits inside Data transfer out.
X-Ray appears in the cost model's observability line but not in the diagram.
And the diagram's note attributes latency routing to CloudFront while the
request path draws Route 53 first, so which service holds the routing policy
is unanswered.

Body sticky 5 -- DO NOT PLACE ON THE BOARD. Bounteous-internal only, cut
before the board is shared, per the client-visible flag above:
Actual attributed AWS spend was not verified. The reporting command
(hopx costs) requires an AWS SSO session and the session had expired, so no
comparison between either diagram and what is running today exists yet. Run
it before the board is presented. If something is running that neither
diagram shows, this is where it lands.
```

## Section 2 -- What the screens look like


What the screens look like, walked in the order a viewer sees them. 15 of the
23 committed Figma frames are on the board. The other 8 are listed at the end
with a reason each. 15 + 8 = 23, all accounted for.

Walk order and cluster grouping follow the prototype's real 22-step order in
`product/design/poc-realignment-plan.md` section 3 (confirmed by stepping the live
prototype, not assumed from file names).

CONSISTENCY NOTE carried onto every Record frame below: voice notes were cut
from the MLP scope. In the app, Record is a real feature (`app/record.tsx`,
`src/services/audioRecorder.ts`, web only, `MediaRecorder` capture) but there
is no upload, no transcription wiring to a submission, no storage, and no
replay outside the same browser session. The screen's own code comment says
so: "Recording/upload integration to an actual submission remains out of
scope for this screen." Any frame showing Record is labelled gated below, not
shipping.

### Cluster header: Invite and first-run onboarding

#### Item 2.1 -- Invite landing
- **What it is:** The out-of-app share link a new person opens before they have the app installed.
- **Source:** product/design/lucid-board/screens/01-invite.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: Out-of-app invite link. "Matthew has invited you to their Family wall." No POC equivalent exists today.
```

#### Item 2.2 -- Splash
- **What it is:** The animated brand splash shown on first open.
- **Source:** product/design/lucid-board/screens/02-splash.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: Collage splash with wordmark. Replaces the current button-landing splash with an auto-advancing one.
```

#### Item 2.3 -- Personalized welcome
- **What it is:** The first onboarding screen, personalized with the invitee's name.
- **Source:** product/design/lucid-board/screens/03-intro-what-is.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: "Hi Sarah! Welcome to Scribl..." New screen, no POC equivalent.
```

#### Item 2.4 -- Prompt intro
- **What it is:** The screen that hands the invitee the prompt their inviter picked.
- **Source:** product/design/lucid-board/screens/04-intro-prompts.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: "Every Scribl starts with a prompt," inviter's chosen prompt, "Let's Scribl." New screen.
```

#### Item 2.5 -- Guided first drawing, finished
- **What it is:** The payoff state of the guided first canvas.
- **Source:** product/design/lucid-board/screens/05-first-canvas-finished.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: Finished first drawing on the guided canvas. Drawing itself is built (same DrawPad as today); only this first-run framing is new.
```

#### Item 2.6 -- Story input, choose type or record (GATED)
- **What it is:** The fork between typing a caption and recording one.
- **Source:** product/design/lucid-board/screens/06-story-input-select.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes with redaction (cut or gray out the Record option)
- **Board text:**
```
Caption: Type-or-record choice, 280-char text cap, 30-second record cap. GATED: Record captures audio in the browser only, with no upload, no storage, and no replay outside that session. Not shipping as a submission path.
```

#### Item 2.7 -- Story input, complete
- **What it is:** The finished 280-character story caption.
- **Source:** product/design/lucid-board/screens/07-story-input-complete.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: Completed story text under the drawing. TARGET, NOT BUILT: today's app caps captions at 80 characters (app/write.tsx, MAX_LENGTH = 80), not 280.
```

#### Item 2.8 -- Wall explanation
- **What it is:** The screen that explains personal versus group walls before the first share.
- **Source:** product/design/lucid-board/screens/08-wall-explanation.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: "You're almost done." Share-to checklist: Personal, Family, Friends. Restyles the existing channel-picker screen; the picker itself is built.
```

#### Item 2.9 -- First wall payoff
- **What it is:** The Family wall showing the invitee's first posted scribl.
- **Source:** product/design/lucid-board/screens/09-wall-example.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: First scribl posted to the Family wall. The first social payoff moment in onboarding.
```

#### Item 2.10 -- Onboarding complete recap
- **What it is:** The closing "you're ready to go" recap screen.
- **Source:** product/design/lucid-board/screens/10-get-started.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes with redaction (cut the artifacts line, see note)
- **Board text:**
```
Caption: "You're ready to go!" Recap lists streaks, artifacts, social share, custom prompts. NOT ALL BUILT: artifact creation is out of scope for this program; custom prompts are not confirmed in the POC. Recap copy overstates what ships.
```

### Cluster header: Daily prompt loop

#### Item 2.11 -- Today's prompt
- **What it is:** The daily returning-user home screen.
- **Source:** product/design/lucid-board/screens/11-daily-prompt.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: "Today's prompt" card with "Let's Scribl." Restyles the existing home screen.
```

#### Item 2.12 -- Daily canvas, Write or Record fork (GATED)
- **What it is:** The regular drawing canvas with the post-draw Write/Record choice.
- **Source:** product/design/lucid-board/screens/12-daily-prompt-blank.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes with redaction (cut or gray out the Record button)
- **Board text:**
```
Caption: Six-ink canvas with Write and Record buttons. GATED: Record button leads to browser-only audio capture with no upload or storage behind it. Not shipping.
```

#### Item 2.13 -- Daily story, complete with share
- **What it is:** The story editor merged with the share-to checklist on one screen.
- **Source:** product/design/lucid-board/screens/13-daily-prompt-story-complete.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: Completed story with share checkboxes inline. TARGET, NOT BUILT: today's app runs this as two separate screens (write, then choose channels), not one merged step.
```

### Cluster header: Wall and dashboard

#### Item 2.14 -- Dashboard
- **What it is:** The stats-and-walls-list home surface.
- **Source:** product/design/lucid-board/screens/14-dashboard.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes
- **Board text:**
```
Caption: "Your Stats" card and "Your Walls" list. Stats card is new; the walls list restyles the existing home screen.
```

#### Item 2.15 -- Family wall grid
- **What it is:** The wall grid a person browses day to day.
- **Source:** product/design/lucid-board/screens/15-family-wall.png
- **Shape and size:** image, approx 400 x 800
- **Client-visible:** Yes with redaction (cut or gray out the bottom nav)
- **Board text:**
```
Caption: Wall grid with rounded tiles and a bottom nav bar. TARGET, NOT BUILT: the current app screen has no bottom tab bar.
```

### Frames excluded

23 total frames in `product/design/figma-exports/`. 15 selected above, 8 excluded here.

- App Icon.png -- app icon swap, not a screen state; nothing to walk.
- Title Animation 2.png -- same splash asset replayed on later launches, duplicate of item 2.2.
- First Canvas.png -- blank state of the guided canvas; the finished state (item 2.5) tells the same story with less redundancy.
- Story Input Blank.png -- blank state of the story editor; the complete state (item 2.7) carries the caption-cap point already.
- Daily Prompt Finished.png -- duplicate of item 2.12's Write/Record fork with a drawing already in the canvas; same Record-gating point, no new information.
- Daily Prompt Story Blank.png -- blank state of the daily story editor; the complete state (item 2.13) is the one with the share-checklist merge worth showing.
- Artifact Select.png -- artifact/keepsake feature, out of scope for this program (poc-realignment-plan.md section 6 flags it as new, unscoped work).
- Artifact Created.png -- same artifact feature, out of scope, paired with Artifact Select.png.

## Section 3 -- Open questions with assignable ownership


Source doc holds 57 questions across five urgency groups plus a client-facing extract. That
is too much for a board. Recommendation: put Q5 up as its own large card, put Group A up as
a table (it is the only group where every row is blocking work in flight right now), and
leave Groups B, C, D, E off the board entirely. They are real but they are not "point at a
person in a room" material for this session, they are backlog for the tracking doc. If Rob
wants a second board pass, Group B is the next candidate, it is the next-biggest cluster and
it already has a client-facing subset written out for him in the source doc's extract
section.

Client-visible flag follows the source file's own rule: any row owned by David Lawton,
Pramod Kumar, or Rob Forshier, alone or as the lead name before "with", is Bounteous-internal
and gets Client-visible: No.

### Item 3.1 -- Q5: Apple Developer account (large standalone card)

- **What it is:** The single highest-value open question on the board. It gates the iOS
  build path end to end.
- **Source:** `tracking/open-questions.md`, Group A, Q5. `tracking/backlog-epics.md` lines 799,
  804, 818, 1247.
- **Shape and size:** Frame, one large card, approx 900 x 600, set apart from every table on
  the board.
- **Client-visible:** Yes.
- **Board text:**

```
Q5 -- APPLE DEVELOPER ACCOUNT

Will Scribl provision an Apple Developer account, and when?

Scribl holds neither an Apple Developer nor a Google Play account today.
This phase is iOS only, so Apple is the urgent half.

OWNER: Eric Rice, with Matthew Kaplan if it needs a signature

WHAT IT BLOCKS:
- E07-F1, Apple Developer account and signing identity
- E07-F3, automated iOS build
- E07-F4, TestFlight distribution
- The first TestFlight build
- The first client demo

WHY IT IS THE TOP ITEM ON THIS BOARD:
No account means no signing identity, no provisioning profiles, no
TestFlight, no device distribution, and no App Store submission path.

DONE LOOKS LIKE:
Scribl has an active Apple Developer account, Bounteous has been added
to it with the access the iOS team needs, and a signing identity and
provisioning profile exist for the app.

FIRST RAISED: 2026-08-19
STATUS: Open
```

### Item 3.2 -- Group A, blocking work in flight (table)

- **What it is:** Every question that blocks work running right now, minus Q5, which has its
  own card in Item 3.1.
- **Source:** `tracking/open-questions.md`, Group A.
- **Shape and size:** Table, 5 cols x 14 rows (1 header + 13 questions), approx 1600 x 1000.
  A room needs to read this
  one, a sticky cluster would bury the blast-radius column that makes the urgency legible.
- **Client-visible:** Yes with redaction. For the client-facing variant delete rows Q45,
  Q47, Q48, Q54, Q6 and Q42, every row whose owner is David Lawton, Pramod Kumar or Rob
  Forshier. That is the source file's own internal-owner rule and it leaves seven rows.
  Q6 in particular must not go up, it names a staffing gap on our side.
- **Board text:**

| ID | Question | Owner | Blocks | Client-visible |
|---|---|---|---|---|
| Q44 | Which iOS versions, which iPhone models, and is iPad in scope? Nothing has been targeted. | Neelesh Aggarwal to recommend with Pankaj Aggarwal, Eric Rice to confirm | Every estimate, the QA device matrix, the test plan | Yes |
| Q45 | How does a build reach Scribl's testers, and is it TestFlight? | David Lawton with Rob Forshier, as a written recommendation to Scribl | The first demo. Also rides on Q5 | No |
| Q46 | How many internal and external testers will Scribl need on the beta? | Eric Rice | The beta group shape and the TestFlight configuration | Yes |
| Q47 | Who provisions the build host and release pipeline, laptops or CI? | Pramod Kumar with Pankaj Aggarwal | The first signed build, regardless of Q5 and Q45 | No |
| Q48 | Which testing layers are in scope, and is 80 percent unit coverage the bar? | Pramod Kumar with Karuna Arshakota and David Lawton, internal | Capacity across all three sprints, the largest uncosted item on the page | No |
| Q54 | Why can Pankaj Aggarwal not access the Bitbucket repo? | Rob Forshier with Pramod Kumar, internal | The engineering lead and architect cannot read the code today | No |
| Q1 | Should the drawing canvas be a dark surface or paper-white? | Christina Strachoff | The background token being written into the brand theme today | Yes |
| Q2 | Is the canvas brush size selector four sizes or one? | Christina Strachoff | Sequence item 3, reduced tool set, in flight | Yes |
| Q3 | Does the splash animate, or ship static? | Christina Strachoff | Sequence item 2, icon and splash swap, in flight | Yes |
| Q4 | What is the muted text color? | Christina Strachoff | One token, appears on every subtitle and meta line | Yes |
| Q6 | Who is the full-time iOS developer under Neelesh Aggarwal? | Pramod Kumar | Makes iOS feature work serial, biggest staffing risk on the engagement | No |
| Q7 | Does sprint 1 start Wednesday 2026-09-02 or Wednesday 2026-09-09? | David Lawton internally, then Eric Rice to confirm | The final demo date and every recurring client invite | Yes |
| Q42 | Which day is the sprint release day? | David Lawton with Pramod Kumar | Rides on Q7, same-conversation answer once Q7 is fixed | No |

### Recommendation on what stays off the board

Groups B, C, D, and E, 42 more rows, stay off. Reasons, plainly:

- Group B (Q8 to Q17, Q49 to Q53, Q56) is real and mostly client-facing, but it blocks the
  next block of work, not work in flight today. It is table material for a follow-up board,
  not this session's room.
- Group C (Q18, Q19, Q21) is gated on a scheduled client call, there is nothing a room can
  decide on these today.
- Group D (Q22 to Q27, Q43, Q55) is people and ownership housekeeping. Named owners already
  exist for each row in the source doc, so this is a follow-up email, not a board item.
- Group E (Q28 to Q37, Q57) is explicitly later-phase. Putting it on the board today dilutes
  the two items that actually need a decision in this room.

If a second board is built for Group B, use the source doc's own "Client-facing extract"
section at the end of `tracking/open-questions.md`. It is already written as copy-and-send
prose with question IDs attached and needs no further editing to be client-safe.

## Section 4 -- Capacity, who is on what


This section is about people and load, not totals. The build lanes overrun capacity, and the
overrun is not close. The plan does not fit as written.

**On the two supply numbers.** The source document reports capacity two ways and both are
correct for what they measure. 105 lane-days is the full three-sprint team: three build
lanes (iOS, Backend and AWS, QA) plus Pramod Kumar's delivery-management lane. 99 lane-days
is the three build lanes alone, with delivery management's 6 days pulled out, because
delivery-lane items on the backlog are unsized client and vendor coordination rather than
build work and cannot absorb engineering demand. Every ratio in this section is demand
against the 99, because that is the number an idle QA-day or an over-committed iOS-day
actually competes against. The 105 appears once, in item 4.3, to show where the other 6
days sit.

### Item 4.1 -- Capacity overrun, per lane, against the fixed line

- **What it is:** A horizontal bar per build lane, green-band load stacked with orange-band
  load, against a fixed vertical capacity line, so the overrun is visible without reading a
  percentage.
- **Source:** tracking/backlog-epics.md, "Capacity arithmetic" section (Supply and demand
  per lane table, and the iOS lane and backend lane subsections).
- **Shape and size:** frame, three horizontal bars plus one vertical capacity line, approx
  1050 x 440 board units. Scale: 10 board units per lane-day. Bar origin x = 150 (left label
  column). Row height 80, row gap 40, first row top y = 40.
- **Client-visible:** Yes with redaction (strip the day counts from the left-hand labels, the
  same cut item 4.2 takes, since those labels name individuals; the bar lengths and the capacity
  line carry the story without them).
- **Board text:**

```
Title: Three build lanes, one plan, and it does not fit
Subtitle: Bar length in lane-days at 10 units per day. Capacity line marks each lane's
supply. Where the bar crosses the line, that lane is over.

Legend:
- Green segment: green-band demand
- Orange segment: orange-band demand, stacked after green
- Red vertical tick: capacity line, this lane's supply in lane-days

Row 1 -- iOS (Neelesh Aggarwal)
  Bar origin: x=150, y=40, height=60
  Green segment: x=150 to x=560 (410 units = 41 days)
  Orange segment: x=560 to x=650 (90 units = 9 days)
  Capacity line: vertical tick at x=450 (300 units = 30 days), spanning y=30 to y=110
  Label left of bar: "iOS -- Neelesh Aggarwal, 30 days"
  Label right of bar: "41 green / 50 with orange"

Row 2 -- Backend and AWS (Nitish Goyal, Pankaj Aggarwal)
  Bar origin: x=150, y=160, height=60
  Green segment: x=150 to x=690 (540 units = 54 days)
  Orange segment: x=690 to x=960 (270 units = 27 days)
  Capacity line: vertical tick at x=540 (390 units = 39 days), spanning y=150 to y=230
  Label left of bar: "Backend and AWS -- Nitish Goyal 30, Pankaj Aggarwal 9, 39 days"
  Label right of bar: "54 green / 81 with orange"

Row 3 -- QA (Karuna Arshakota)
  Bar origin: x=150, y=280, height=60
  Green segment: x=150 to x=390 (240 units = 24 days)
  Orange segment: none, 0 days
  Capacity line: vertical tick at x=450 (300 units = 30 days), spanning y=270 to y=350
  Label left of bar: "QA -- Karuna Arshakota, 30 days"
  Label right of bar: "24 green / 24 with orange"

Bottom caption, y=400:
This plan does not fit. iOS is 11 days over on green and backend is 15 over. QA holds the
only slack, 6 days, and QA-days do not convert into iOS-days or backend-days.
The backend bar's 54 green days include the 1 platform lane-day, which the source
table lists separately but funds out of Pankaj Aggarwal's share.
```

### Item 4.2 -- Who is on what

- **What it is:** A sticky per person naming their lane and their day supply, so the board
  shows load against named individuals rather than an anonymous lane.
- **Source:** tracking/backlog-epics.md, "Capacity arithmetic" section (Supply and demand
  table, Person-weeks table); knowledge/team/roster.md.
- **Shape and size:** sticky cluster, 5 stickies in a row, approx 900 x 150.
- **Client-visible:** Yes with redaction, cut the day-supply number from each sticky before
  this goes in front of the client. Naming individual utilization on a client-facing board
  turns a staffing conversation into a performance conversation about named people, which is
  not what this board is for. Keep the names and lanes, drop the numbers, and keep the full
  version (item 4.1, which is lane-level not person-level) as the client-visible capacity
  story.
- **Board text:**

```
Sticky 1: Neelesh Aggarwal -- iOS -- 30 days across three sprints (2.0 person-weeks per sprint)
Sticky 2: Nitish Goyal -- Backend and AWS -- 30 days across three sprints (2.0 person-weeks per sprint)
Sticky 3: Pankaj Aggarwal -- Backend and AWS, engineering lead and architect, split across accounts -- 9 days across three sprints (0.6 person-weeks per sprint)
Sticky 4: Karuna Arshakota -- QA -- 30 days across three sprints (2.0 person-weeks per sprint)
Sticky 5: Pramod Kumar -- Delivery management -- 6 days across three sprints (0.4 person-weeks per sprint), not counted in the build-lane totals
```

### Item 4.3 -- The totals, and which supply number is which

- **What it is:** A small reference table pairing the two supply numbers used across this
  package with what each one includes, so nobody quotes 99 where the source means 105 or the
  reverse.
- **Source:** tracking/backlog-epics.md, "Capacity arithmetic" section, lines around the
  Supply and demand per lane table and the "Read the lane rows rather than the total"
  paragraph.
- **Shape and size:** table, 2 cols x 5 rows (1 header + 4 body), approx 500 x 240.
- **Client-visible:** Yes.
- **Board text:**

| Supply figure | What it includes |
|---|---|
| 99 lane-days | The three build lanes only: iOS 30, Backend and AWS 39, QA 30. This is the number every ratio in item 4.1 is measured against. |
| 105 lane-days | The 99 build-lane days plus Pramod Kumar's 6 delivery-management days, which are unsized client and vendor coordination and cannot absorb build demand. |
| Green demand | 119 lane-days against the 99, a 120 percent load. That is iOS 41 plus backend 54 plus QA 24, where backend's 54 carries the 1 platform lane-day the source table lists on its own row. Fifteen features are honestly unsized, fourteen live plus one parked, so 119 is a floor, not a ceiling. |
| Green plus orange demand | 155 lane-days against the 99, a 157 percent load. That is the 119 green plus 36 orange, iOS 9 and backend 27. |
