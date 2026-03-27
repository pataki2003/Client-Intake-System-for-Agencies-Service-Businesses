-- Portfolio-ready demo seed data for Client Intake System.
-- Apply this after the schema migrations in supabase/migrations/.

begin;

insert into public.clients (
  id,
  client_name,
  company_name,
  email,
  phone,
  website,
  created_at,
  updated_at
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Amelia Grant',
    'Northline Growth Advisory',
    'amelia@northlinegrowth.com',
    '(312) 555-0148',
    'https://northlinegrowth.com',
    '2026-03-18T09:20:00Z',
    '2026-03-21T14:10:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Luis Ramirez',
    'Harbor Bay Plumbing',
    'luis@harborbayplumbing.com',
    '(619) 555-0136',
    'https://harborbayplumbing.com',
    '2026-03-24T15:10:00Z',
    '2026-03-24T15:13:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'Nina Patel',
    'Ledger Lane Advisory',
    'nina@ledgerlaneadvisory.com',
    '(917) 555-0172',
    'https://ledgerlaneadvisory.com',
    '2026-03-12T11:05:00Z',
    '2026-03-20T10:40:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'Jordan Chen',
    'RelayStack',
    'jordan@relaystack.io',
    '(415) 555-0129',
    'https://relaystack.io',
    '2026-03-16T08:40:00Z',
    '2026-03-25T16:20:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'Erin Brooks',
    'Signal Harbor Compliance',
    'erin@signalharbor.com',
    '(206) 555-0163',
    'https://signalharbor.com',
    '2026-03-05T13:20:00Z',
    '2026-03-08T09:35:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    'Sophie Martin',
    'Framewise',
    'sophie@framewise.app',
    '(646) 555-0114',
    'https://framewise.app',
    '2026-03-26T10:15:00Z',
    '2026-03-26T10:17:00Z'
  )
on conflict (id) do update
set
  client_name = excluded.client_name,
  company_name = excluded.company_name,
  email = excluded.email,
  phone = excluded.phone,
  website = excluded.website,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.intakes (
  id,
  client_id,
  status,
  service_requested,
  budget_range,
  timeline,
  project_summary,
  business_goals,
  current_challenges,
  referral_source,
  additional_info,
  confirmation_sent_at,
  source_metadata,
  created_at,
  updated_at
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'reviewing',
    'Web design & development',
    '10000_25000',
    'within_60_days',
    $goal_1$
We need to reposition our site so it reflects the level of strategy work we do today, not the smaller messaging projects we started with. The new site should make our offer easier to understand, show stronger proof, and help qualified prospects come into sales calls with the right expectations.
$goal_1$,
    'Position the firm for larger retained strategy engagements and improve inquiry quality.',
    $problem_1$
Our current site still reads like a generalist consultancy. The messaging is too broad, the case studies do not support the premium end of the market, and most of the nuance gets explained manually on calls. We are getting inquiries, but not enough from the right kind of client.
$problem_1$,
    'Introduced by a former client',
    $extra_1$
We already have recent client testimonials and a few engagement summaries, but we would need help shaping them into stronger proof. Copy support would be valuable if it is part of the engagement.
$extra_1$,
    '2026-03-18T09:24:00Z',
    jsonb_build_object(
      'referer', 'https://northlinegrowth.com/start-project?utm_source=client_referral&utm_medium=email&utm_campaign=spring_repositioning',
      'landingPath', '/start-project',
      'tracking', jsonb_build_object(
        'utm_source', 'client_referral',
        'utm_medium', 'email',
        'utm_campaign', 'spring_repositioning'
      )
    ),
    '2026-03-18T09:20:00Z',
    '2026-03-21T14:10:00Z'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'new',
    'SEO',
    '5000_10000',
    'within_90_days',
    $goal_2$
We want to improve local visibility for our core service areas so homeowners find us before they call a larger chain. The main goal is to generate more qualified calls for drain, water heater, and emergency plumbing work without relying so heavily on referrals.
$goal_2$,
    'Increase qualified local inbound leads in priority neighborhoods.',
    $problem_2$
Our search presence is inconsistent across locations, the site pages are thin, and we are still getting calls from outside the areas we actually service. We know people are searching for these jobs, but the current setup does not help us rank or convert well.
$problem_2$,
    'Google search',
    $extra_2$
We already have a Google Business Profile and some service pages, but nothing has been touched strategically in over a year. We can move quickly if the first phase is focused and practical.
$extra_2$,
    '2026-03-24T15:13:00Z',
    jsonb_build_object(
      'referer', 'https://www.google.com/',
      'landingPath', '/start-project',
      'tracking', jsonb_build_object(
        'source', 'organic_search'
      )
    ),
    '2026-03-24T15:10:00Z',
    '2026-03-24T15:13:00Z'
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    'brief_ready',
    'Branding',
    '10000_25000',
    'within_60_days',
    $goal_3$
We have outgrown the visual identity and positioning we launched with when the practice was referral-only. We need a sharper brand system and clearer messaging that makes us look credible to SaaS and professional services teams looking for a senior finance partner.
$goal_3$,
    'Support a move upmarket and make the firm easier to trust before the first call.',
    $problem_3$
The current brand feels closer to bookkeeping than strategic finance advisory. It undersells the level of work we do, makes the firm feel smaller than it is, and creates hesitation with the higher-value clients we want to attract.
$problem_3$,
    'Referral from a former design client',
    $extra_3$
We do not need naming from scratch, but we are open to light messaging architecture and guidance on how the new brand should carry into the site.
$extra_3$,
    '2026-03-12T11:08:00Z',
    null,
    '2026-03-12T11:05:00Z',
    '2026-03-20T10:40:00Z'
  ),
  (
    '20000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000004',
    'contacted',
    'Automation & systems',
    '25000_plus',
    'asap',
    $goal_4$
We want to reduce the manual work between closed-won and kickoff so onboarding is faster, more consistent, and less dependent on one operations lead catching every handoff. The project needs to connect sales data, provisioning steps, and internal notifications into one reliable workflow.
$goal_4$,
    'Reduce onboarding lag, eliminate avoidable handoff errors, and improve team capacity.',
    $problem_4$
Right now the team is copying information across HubSpot, Notion, Slack, Stripe, and internal docs by hand. Details get missed, kickoff dates slip, and onboarding quality changes depending on who is online that day.
$problem_4$,
    'Operations newsletter',
    $extra_4$
We already know this is larger than a few Zaps. We would value an initial audit and phased rollout rather than a rushed implementation.
$extra_4$,
    '2026-03-16T08:44:00Z',
    jsonb_build_object(
      'referer', 'https://relaystack.io/operations-audit?utm_source=ops_audit_cta&utm_medium=website&utm_campaign=spring_pipeline',
      'landingPath', '/start-project',
      'tracking', jsonb_build_object(
        'utm_source', 'ops_audit_cta',
        'utm_medium', 'website',
        'utm_campaign', 'spring_pipeline'
      )
    ),
    '2026-03-16T08:40:00Z',
    '2026-03-25T16:20:00Z'
  ),
  (
    '20000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000005',
    'archived',
    'Content strategy',
    'undisclosed',
    'flexible',
    $goal_5$
We want a content strategy that helps technical buyers understand the practical difference between our compliance retainer and one-off audit work. The goal is to build a more credible library of educational content before we invest in heavier outbound.
$goal_5$,
    'Clarify the role of content in pipeline development without committing to a large program too early.',
    $problem_5$
We have subject matter expertise, but the current blog is inconsistent and written case by case. Internally there is not enough time to turn client questions into useful content, and leadership is not aligned yet on whether this should become a full program or a lighter advisory engagement.
$problem_5$,
    'Podcast mention',
    $extra_5$
Timing may shift. We are collecting options now, but this may not become active until after an internal restructure this summer.
$extra_5$,
    null,
    null,
    '2026-03-05T13:20:00Z',
    '2026-03-08T09:35:00Z'
  ),
  (
    '20000000-0000-4000-8000-000000000006',
    '10000000-0000-4000-8000-000000000006',
    'new',
    'Paid ads',
    '5000_10000',
    'within_30_days',
    $goal_6$
We need to improve the performance of paid acquisition for our self-serve product launch. Specifically, we want the landing experience to match ad intent more closely so trial signups improve before we increase spend.
$goal_6$,
    'Lower acquisition cost before scaling paid spend.',
    $problem_6$
Cost per trial has climbed over the last six weeks and the landing page is doing too much at once. Messaging shifts between audiences, feature proof is thin, and the current page does not make a strong case for why someone should start a trial immediately.
$problem_6$,
    'Paid social click',
    $extra_6$
We already have active Meta and Google campaigns, plus heatmap data and a few user interview notes. We are looking for a focused engagement around messaging, conversion flow, and paid traffic alignment.
$extra_6$,
    '2026-03-26T10:17:00Z',
    jsonb_build_object(
      'referer', 'https://framewise.app/launch?utm_source=paid_social&utm_medium=cpc&utm_campaign=trial_push',
      'landingPath', '/start-project',
      'tracking', jsonb_build_object(
        'utm_source', 'paid_social',
        'utm_medium', 'cpc',
        'utm_campaign', 'trial_push'
      )
    ),
    '2026-03-26T10:15:00Z',
    '2026-03-26T10:17:00Z'
  )
on conflict (id) do update
set
  client_id = excluded.client_id,
  status = excluded.status,
  service_requested = excluded.service_requested,
  budget_range = excluded.budget_range,
  timeline = excluded.timeline,
  project_summary = excluded.project_summary,
  business_goals = excluded.business_goals,
  current_challenges = excluded.current_challenges,
  referral_source = excluded.referral_source,
  additional_info = excluded.additional_info,
  confirmation_sent_at = excluded.confirmation_sent_at,
  source_metadata = excluded.source_metadata,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.intake_answers (
  id,
  intake_id,
  question_key,
  question_label,
  answer_type,
  answer_value,
  display_order,
  created_at,
  updated_at
)
values
  ('30000000-0000-4000-8000-000000000101', '20000000-0000-4000-8000-000000000001', 'name', 'Name', 'text', jsonb_build_object('value', 'Amelia Grant'), 0, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),
  ('30000000-0000-4000-8000-000000000102', '20000000-0000-4000-8000-000000000001', 'email', 'Email', 'email', jsonb_build_object('value', 'amelia@northlinegrowth.com'), 1, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),
  ('30000000-0000-4000-8000-000000000103', '20000000-0000-4000-8000-000000000001', 'company_name', 'Company name', 'text', jsonb_build_object('value', 'Northline Growth Advisory'), 2, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),
  ('30000000-0000-4000-8000-000000000104', '20000000-0000-4000-8000-000000000001', 'service_type', 'Service type', 'single_select', jsonb_build_object('option', 'web_design_development', 'otherValue', null, 'value', 'Web design & development'), 3, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),
  ('30000000-0000-4000-8000-000000000105', '20000000-0000-4000-8000-000000000001', 'goal', 'Goal', 'long_text', jsonb_build_object('value', $ans_goal_1$
We need to reposition our site so it reflects the level of strategy work we do today, not the smaller messaging projects we started with. The new site should make our offer easier to understand, show stronger proof, and help qualified prospects come into sales calls with the right expectations.
$ans_goal_1$), 4, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),
  ('30000000-0000-4000-8000-000000000106', '20000000-0000-4000-8000-000000000001', 'problem_description', 'Problem description', 'long_text', jsonb_build_object('value', $ans_problem_1$
Our current site still reads like a generalist consultancy. The messaging is too broad, the case studies do not support the premium end of the market, and most of the nuance gets explained manually on calls. We are getting inquiries, but not enough from the right kind of client.
$ans_problem_1$), 5, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),
  ('30000000-0000-4000-8000-000000000107', '20000000-0000-4000-8000-000000000001', 'deadline', 'Deadline', 'text', jsonb_build_object('value', '2026-05-15'), 6, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),
  ('30000000-0000-4000-8000-000000000108', '20000000-0000-4000-8000-000000000001', 'budget_range', 'Budget range', 'single_select', jsonb_build_object('value', '10000_25000'), 7, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),
  ('30000000-0000-4000-8000-000000000109', '20000000-0000-4000-8000-000000000001', 'extra_notes', 'Extra notes', 'long_text', jsonb_build_object('value', $ans_extra_1$
We already have recent client testimonials and a few engagement summaries, but we would need help shaping them into stronger proof. Copy support would be valuable if it is part of the engagement.
$ans_extra_1$), 8, '2026-03-18T09:20:00Z', '2026-03-18T09:20:00Z'),

  ('30000000-0000-4000-8000-000000000201', '20000000-0000-4000-8000-000000000002', 'name', 'Name', 'text', jsonb_build_object('value', 'Luis Ramirez'), 0, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),
  ('30000000-0000-4000-8000-000000000202', '20000000-0000-4000-8000-000000000002', 'email', 'Email', 'email', jsonb_build_object('value', 'luis@harborbayplumbing.com'), 1, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),
  ('30000000-0000-4000-8000-000000000203', '20000000-0000-4000-8000-000000000002', 'company_name', 'Company name', 'text', jsonb_build_object('value', 'Harbor Bay Plumbing'), 2, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),
  ('30000000-0000-4000-8000-000000000204', '20000000-0000-4000-8000-000000000002', 'service_type', 'Service type', 'single_select', jsonb_build_object('option', 'seo', 'otherValue', null, 'value', 'SEO'), 3, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),
  ('30000000-0000-4000-8000-000000000205', '20000000-0000-4000-8000-000000000002', 'goal', 'Goal', 'long_text', jsonb_build_object('value', $ans_goal_2$
We want to improve local visibility for our core service areas so homeowners find us before they call a larger chain. The main goal is to generate more qualified calls for drain, water heater, and emergency plumbing work without relying so heavily on referrals.
$ans_goal_2$), 4, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),
  ('30000000-0000-4000-8000-000000000206', '20000000-0000-4000-8000-000000000002', 'problem_description', 'Problem description', 'long_text', jsonb_build_object('value', $ans_problem_2$
Our search presence is inconsistent across locations, the site pages are thin, and we are still getting calls from outside the areas we actually service. We know people are searching for these jobs, but the current setup does not help us rank or convert well.
$ans_problem_2$), 5, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),
  ('30000000-0000-4000-8000-000000000207', '20000000-0000-4000-8000-000000000002', 'deadline', 'Deadline', 'text', jsonb_build_object('value', '2026-06-10'), 6, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),
  ('30000000-0000-4000-8000-000000000208', '20000000-0000-4000-8000-000000000002', 'budget_range', 'Budget range', 'single_select', jsonb_build_object('value', '5000_10000'), 7, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),
  ('30000000-0000-4000-8000-000000000209', '20000000-0000-4000-8000-000000000002', 'extra_notes', 'Extra notes', 'long_text', jsonb_build_object('value', $ans_extra_2$
We already have a Google Business Profile and some service pages, but nothing has been touched strategically in over a year. We can move quickly if the first phase is focused and practical.
$ans_extra_2$), 8, '2026-03-24T15:10:00Z', '2026-03-24T15:10:00Z'),

  ('30000000-0000-4000-8000-000000000301', '20000000-0000-4000-8000-000000000003', 'name', 'Name', 'text', jsonb_build_object('value', 'Nina Patel'), 0, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z'),
  ('30000000-0000-4000-8000-000000000302', '20000000-0000-4000-8000-000000000003', 'email', 'Email', 'email', jsonb_build_object('value', 'nina@ledgerlaneadvisory.com'), 1, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z'),
  ('30000000-0000-4000-8000-000000000303', '20000000-0000-4000-8000-000000000003', 'company_name', 'Company name', 'text', jsonb_build_object('value', 'Ledger Lane Advisory'), 2, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z'),
  ('30000000-0000-4000-8000-000000000304', '20000000-0000-4000-8000-000000000003', 'service_type', 'Service type', 'single_select', jsonb_build_object('option', 'branding', 'otherValue', null, 'value', 'Branding'), 3, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z'),
  ('30000000-0000-4000-8000-000000000305', '20000000-0000-4000-8000-000000000003', 'goal', 'Goal', 'long_text', jsonb_build_object('value', $ans_goal_3$
We have outgrown the visual identity and positioning we launched with when the practice was referral-only. We need a sharper brand system and clearer messaging that makes us look credible to SaaS and professional services teams looking for a senior finance partner.
$ans_goal_3$), 4, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z'),
  ('30000000-0000-4000-8000-000000000306', '20000000-0000-4000-8000-000000000003', 'problem_description', 'Problem description', 'long_text', jsonb_build_object('value', $ans_problem_3$
The current brand feels closer to bookkeeping than strategic finance advisory. It undersells the level of work we do, makes the firm feel smaller than it is, and creates hesitation with the higher-value clients we want to attract.
$ans_problem_3$), 5, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z'),
  ('30000000-0000-4000-8000-000000000307', '20000000-0000-4000-8000-000000000003', 'deadline', 'Deadline', 'text', jsonb_build_object('value', '2026-04-28'), 6, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z'),
  ('30000000-0000-4000-8000-000000000308', '20000000-0000-4000-8000-000000000003', 'budget_range', 'Budget range', 'single_select', jsonb_build_object('value', '10000_25000'), 7, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z'),
  ('30000000-0000-4000-8000-000000000309', '20000000-0000-4000-8000-000000000003', 'extra_notes', 'Extra notes', 'long_text', jsonb_build_object('value', $ans_extra_3$
We do not need naming from scratch, but we are open to light messaging architecture and guidance on how the new brand should carry into the site.
$ans_extra_3$), 8, '2026-03-12T11:05:00Z', '2026-03-12T11:05:00Z')
on conflict (intake_id, question_key) do update
set
  id = excluded.id,
  question_label = excluded.question_label,
  answer_type = excluded.answer_type,
  answer_value = excluded.answer_value,
  display_order = excluded.display_order,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.intake_answers (
  id,
  intake_id,
  question_key,
  question_label,
  answer_type,
  answer_value,
  display_order,
  created_at,
  updated_at
)
values
  ('30000000-0000-4000-8000-000000000401', '20000000-0000-4000-8000-000000000004', 'name', 'Name', 'text', jsonb_build_object('value', 'Jordan Chen'), 0, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),
  ('30000000-0000-4000-8000-000000000402', '20000000-0000-4000-8000-000000000004', 'email', 'Email', 'email', jsonb_build_object('value', 'jordan@relaystack.io'), 1, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),
  ('30000000-0000-4000-8000-000000000403', '20000000-0000-4000-8000-000000000004', 'company_name', 'Company name', 'text', jsonb_build_object('value', 'RelayStack'), 2, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),
  ('30000000-0000-4000-8000-000000000404', '20000000-0000-4000-8000-000000000004', 'service_type', 'Service type', 'single_select', jsonb_build_object('option', 'automation', 'otherValue', null, 'value', 'Automation & systems'), 3, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),
  ('30000000-0000-4000-8000-000000000405', '20000000-0000-4000-8000-000000000004', 'goal', 'Goal', 'long_text', jsonb_build_object('value', $ans_goal_4$
We want to reduce the manual work between closed-won and kickoff so onboarding is faster, more consistent, and less dependent on one operations lead catching every handoff. The project needs to connect sales data, provisioning steps, and internal notifications into one reliable workflow.
$ans_goal_4$), 4, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),
  ('30000000-0000-4000-8000-000000000406', '20000000-0000-4000-8000-000000000004', 'problem_description', 'Problem description', 'long_text', jsonb_build_object('value', $ans_problem_4$
Right now the team is copying information across HubSpot, Notion, Slack, Stripe, and internal docs by hand. Details get missed, kickoff dates slip, and onboarding quality changes depending on who is online that day.
$ans_problem_4$), 5, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),
  ('30000000-0000-4000-8000-000000000407', '20000000-0000-4000-8000-000000000004', 'deadline', 'Deadline', 'text', jsonb_build_object('value', '2026-04-10'), 6, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),
  ('30000000-0000-4000-8000-000000000408', '20000000-0000-4000-8000-000000000004', 'budget_range', 'Budget range', 'single_select', jsonb_build_object('value', '25000_plus'), 7, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),
  ('30000000-0000-4000-8000-000000000409', '20000000-0000-4000-8000-000000000004', 'extra_notes', 'Extra notes', 'long_text', jsonb_build_object('value', $ans_extra_4$
We already know this is larger than a few Zaps. We would value an initial audit and phased rollout rather than a rushed implementation.
$ans_extra_4$), 8, '2026-03-16T08:40:00Z', '2026-03-16T08:40:00Z'),

  ('30000000-0000-4000-8000-000000000501', '20000000-0000-4000-8000-000000000005', 'name', 'Name', 'text', jsonb_build_object('value', 'Erin Brooks'), 0, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),
  ('30000000-0000-4000-8000-000000000502', '20000000-0000-4000-8000-000000000005', 'email', 'Email', 'email', jsonb_build_object('value', 'erin@signalharbor.com'), 1, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),
  ('30000000-0000-4000-8000-000000000503', '20000000-0000-4000-8000-000000000005', 'company_name', 'Company name', 'text', jsonb_build_object('value', 'Signal Harbor Compliance'), 2, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),
  ('30000000-0000-4000-8000-000000000504', '20000000-0000-4000-8000-000000000005', 'service_type', 'Service type', 'single_select', jsonb_build_object('option', 'content_strategy', 'otherValue', null, 'value', 'Content strategy'), 3, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),
  ('30000000-0000-4000-8000-000000000505', '20000000-0000-4000-8000-000000000005', 'goal', 'Goal', 'long_text', jsonb_build_object('value', $ans_goal_5$
We want a content strategy that helps technical buyers understand the practical difference between our compliance retainer and one-off audit work. The goal is to build a more credible library of educational content before we invest in heavier outbound.
$ans_goal_5$), 4, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),
  ('30000000-0000-4000-8000-000000000506', '20000000-0000-4000-8000-000000000005', 'problem_description', 'Problem description', 'long_text', jsonb_build_object('value', $ans_problem_5$
We have subject matter expertise, but the current blog is inconsistent and written case by case. Internally there is not enough time to turn client questions into useful content, and leadership is not aligned yet on whether this should become a full program or a lighter advisory engagement.
$ans_problem_5$), 5, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),
  ('30000000-0000-4000-8000-000000000507', '20000000-0000-4000-8000-000000000005', 'deadline', 'Deadline', 'text', jsonb_build_object('value', '2026-07-01'), 6, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),
  ('30000000-0000-4000-8000-000000000508', '20000000-0000-4000-8000-000000000005', 'budget_range', 'Budget range', 'single_select', jsonb_build_object('value', 'undisclosed'), 7, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),
  ('30000000-0000-4000-8000-000000000509', '20000000-0000-4000-8000-000000000005', 'extra_notes', 'Extra notes', 'long_text', jsonb_build_object('value', $ans_extra_5$
Timing may shift. We are collecting options now, but this may not become active until after an internal restructure this summer.
$ans_extra_5$), 8, '2026-03-05T13:20:00Z', '2026-03-05T13:20:00Z'),

  ('30000000-0000-4000-8000-000000000601', '20000000-0000-4000-8000-000000000006', 'name', 'Name', 'text', jsonb_build_object('value', 'Sophie Martin'), 0, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z'),
  ('30000000-0000-4000-8000-000000000602', '20000000-0000-4000-8000-000000000006', 'email', 'Email', 'email', jsonb_build_object('value', 'sophie@framewise.app'), 1, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z'),
  ('30000000-0000-4000-8000-000000000603', '20000000-0000-4000-8000-000000000006', 'company_name', 'Company name', 'text', jsonb_build_object('value', 'Framewise'), 2, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z'),
  ('30000000-0000-4000-8000-000000000604', '20000000-0000-4000-8000-000000000006', 'service_type', 'Service type', 'single_select', jsonb_build_object('option', 'paid_ads', 'otherValue', null, 'value', 'Paid ads'), 3, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z'),
  ('30000000-0000-4000-8000-000000000605', '20000000-0000-4000-8000-000000000006', 'goal', 'Goal', 'long_text', jsonb_build_object('value', $ans_goal_6$
We need to improve the performance of paid acquisition for our self-serve product launch. Specifically, we want the landing experience to match ad intent more closely so trial signups improve before we increase spend.
$ans_goal_6$), 4, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z'),
  ('30000000-0000-4000-8000-000000000606', '20000000-0000-4000-8000-000000000006', 'problem_description', 'Problem description', 'long_text', jsonb_build_object('value', $ans_problem_6$
Cost per trial has climbed over the last six weeks and the landing page is doing too much at once. Messaging shifts between audiences, feature proof is thin, and the current page does not make a strong case for why someone should start a trial immediately.
$ans_problem_6$), 5, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z'),
  ('30000000-0000-4000-8000-000000000607', '20000000-0000-4000-8000-000000000006', 'deadline', 'Deadline', 'text', jsonb_build_object('value', '2026-04-24'), 6, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z'),
  ('30000000-0000-4000-8000-000000000608', '20000000-0000-4000-8000-000000000006', 'budget_range', 'Budget range', 'single_select', jsonb_build_object('value', '5000_10000'), 7, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z'),
  ('30000000-0000-4000-8000-000000000609', '20000000-0000-4000-8000-000000000006', 'extra_notes', 'Extra notes', 'long_text', jsonb_build_object('value', $ans_extra_6$
We already have active Meta and Google campaigns, plus heatmap data and a few user interview notes. We are looking for a focused engagement around messaging, conversion flow, and paid traffic alignment.
$ans_extra_6$), 8, '2026-03-26T10:15:00Z', '2026-03-26T10:15:00Z')
on conflict (intake_id, question_key) do update
set
  id = excluded.id,
  question_label = excluded.question_label,
  answer_type = excluded.answer_type,
  answer_value = excluded.answer_value,
  display_order = excluded.display_order,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.ai_briefs (
  id,
  intake_id,
  brief_markdown,
  brief_json,
  model,
  created_at,
  updated_at
)
values
  (
    '40000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    $brief_markdown_1$
## Client Summary
Northline Growth Advisory is a boutique consultancy helping founder-led B2B companies clarify positioning and tighten go-to-market strategy. They are asking for a website repositioning project that reflects the level of work they do today and helps qualified prospects understand the offer before the first call.

## Business Need
The current site undersells the firm and reads too broadly for the premium engagements they want to win. They need clearer messaging, stronger proof, and a more intentional website structure so the right prospects arrive with stronger context and better fit.

## Suggested Scope
- Clarify the primary offer, audience, and engagement positioning for the homepage and service architecture.
- Restructure the site around a sharper narrative that explains what Northline does, who it is for, and what outcomes clients can expect.
- Refresh case study and proof sections so they support premium strategic work rather than smaller tactical projects.
- Develop conversion-focused page copy or copy guidance for the core pages.
- Design and build a polished marketing site that feels aligned with the firm's current market position.

## Open Questions
- How much copy development does Amelia want included versus handled internally?
- Which case studies can be shared publicly and in what level of detail?
- Are there existing brand assets worth evolving, or should the visual direction be reconsidered more broadly?
- What conversion action matters most: booked calls, qualified inquiries, or a narrower lead screening step?

## Recommended Next Steps
- Review the current site and recent sales conversations to identify the main positioning gaps.
- Run a short discovery session focused on audience, offer clarity, and proof points.
- Define the recommended sitemap and messaging priorities before pricing the build.
- Confirm scope boundaries for strategy, copy, design, and development.
$brief_markdown_1$,
    jsonb_build_object(
      'clientSummary', 'Northline Growth Advisory is a boutique consultancy helping founder-led B2B companies clarify positioning and tighten go-to-market strategy. They are asking for a website repositioning project that reflects the level of work they do today and helps qualified prospects understand the offer before the first call.',
      'businessNeed', 'The current site undersells the firm and reads too broadly for the premium engagements they want to win. They need clearer messaging, stronger proof, and a more intentional website structure so the right prospects arrive with stronger context and better fit.',
      'suggestedScope', jsonb_build_array(
        'Clarify the primary offer, audience, and engagement positioning for the homepage and service architecture.',
        'Restructure the site around a sharper narrative that explains what Northline does, who it is for, and what outcomes clients can expect.',
        'Refresh case study and proof sections so they support premium strategic work rather than smaller tactical projects.',
        'Develop conversion-focused page copy or copy guidance for the core pages.',
        'Design and build a polished marketing site that feels aligned with the firm''s current market position.'
      ),
      'openQuestions', jsonb_build_array(
        'How much copy development does Amelia want included versus handled internally?',
        'Which case studies can be shared publicly and in what level of detail?',
        'Are there existing brand assets worth evolving, or should the visual direction be reconsidered more broadly?',
        'What conversion action matters most: booked calls, qualified inquiries, or a narrower lead screening step?'
      ),
      'recommendedNextSteps', jsonb_build_array(
        'Review the current site and recent sales conversations to identify the main positioning gaps.',
        'Run a short discovery session focused on audience, offer clarity, and proof points.',
        'Define the recommended sitemap and messaging priorities before pricing the build.',
        'Confirm scope boundaries for strategy, copy, design, and development.'
      )
    ),
    'gpt-5-mini',
    '2026-03-19T09:30:00Z',
    '2026-03-21T14:05:00Z'
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000003',
    $brief_markdown_3$
## Client Summary
Ledger Lane Advisory is a fractional CFO and finance advisory practice that has grown beyond its original referral-only positioning. They are looking for a stronger brand and messaging system that feels credible to higher-value SaaS and professional services clients.

## Business Need
The current brand makes the firm look more tactical and lower-tier than the work it now delivers. They need a clearer premium signal so prospects understand the level of strategic partnership on offer before engaging.

## Suggested Scope
- Audit the existing brand and messaging to identify where the current identity signals bookkeeping rather than strategic finance advisory.
- Refine the core positioning, audience language, and brand narrative for an upmarket market presence.
- Create an updated visual identity system that feels credible, senior, and adaptable across web and proposal touchpoints.
- Develop messaging guidance for homepage, offer summary, and introductory sales materials.
- Define practical rollout priorities so the rebrand can extend cleanly into the website.

## Open Questions
- Does Nina want naming exploration excluded entirely, or is a light naming adjustment still on the table?
- Which client segments should the brand prioritize first: SaaS, agencies, or broader professional services?
- What existing materials need to be updated immediately after the brand work is complete?

## Recommended Next Steps
- Review the current identity and sales materials together to pinpoint the biggest credibility gaps.
- Clarify audience priorities and the desired market position before visual exploration begins.
- Recommend a brand scope that includes both strategic positioning and practical rollout deliverables.
- Decide whether website implementation should be bundled or staged after the rebrand.
$brief_markdown_3$,
    jsonb_build_object(
      'clientSummary', 'Ledger Lane Advisory is a fractional CFO and finance advisory practice that has grown beyond its original referral-only positioning. They are looking for a stronger brand and messaging system that feels credible to higher-value SaaS and professional services clients.',
      'businessNeed', 'The current brand makes the firm look more tactical and lower-tier than the work it now delivers. They need a clearer premium signal so prospects understand the level of strategic partnership on offer before engaging.',
      'suggestedScope', jsonb_build_array(
        'Audit the existing brand and messaging to identify where the current identity signals bookkeeping rather than strategic finance advisory.',
        'Refine the core positioning, audience language, and brand narrative for an upmarket market presence.',
        'Create an updated visual identity system that feels credible, senior, and adaptable across web and proposal touchpoints.',
        'Develop messaging guidance for homepage, offer summary, and introductory sales materials.',
        'Define practical rollout priorities so the rebrand can extend cleanly into the website.'
      ),
      'openQuestions', jsonb_build_array(
        'Does Nina want naming exploration excluded entirely, or is a light naming adjustment still on the table?',
        'Which client segments should the brand prioritize first: SaaS, agencies, or broader professional services?',
        'What existing materials need to be updated immediately after the brand work is complete?'
      ),
      'recommendedNextSteps', jsonb_build_array(
        'Review the current identity and sales materials together to pinpoint the biggest credibility gaps.',
        'Clarify audience priorities and the desired market position before visual exploration begins.',
        'Recommend a brand scope that includes both strategic positioning and practical rollout deliverables.',
        'Decide whether website implementation should be bundled or staged after the rebrand.'
      )
    ),
    'gpt-5-mini',
    '2026-03-18T14:20:00Z',
    '2026-03-20T09:45:00Z'
  )
on conflict (intake_id) do update
set
  id = excluded.id,
  brief_markdown = excluded.brief_markdown,
  brief_json = excluded.brief_json,
  model = excluded.model,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

insert into public.internal_notes (
  id,
  intake_id,
  author_id,
  body,
  created_at,
  updated_at
)
values
  (
    '50000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    null,
    'Strong fit. The messaging gap is obvious from the current site, and the budget range supports a repositioning-led website engagement.',
    '2026-03-19T10:00:00Z',
    '2026-03-19T10:00:00Z'
  ),
  (
    '50000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000001',
    null,
    'Confirm whether Amelia wants copy strategy included or whether their team can provide structured source material and case study inputs.',
    '2026-03-21T14:15:00Z',
    '2026-03-21T14:15:00Z'
  ),
  (
    '50000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000003',
    null,
    'Referral from Westbrook Studio. This likely needs positioning and identity refinement, not just visual cleanup.',
    '2026-03-18T15:00:00Z',
    '2026-03-18T15:00:00Z'
  ),
  (
    '50000000-0000-4000-8000-000000000004',
    '20000000-0000-4000-8000-000000000004',
    null,
    'Sent a follow-up with audit-first options. Recommend scoping discovery separately from implementation so systems dependencies are documented first.',
    '2026-03-25T16:30:00Z',
    '2026-03-25T16:30:00Z'
  ),
  (
    '50000000-0000-4000-8000-000000000005',
    '20000000-0000-4000-8000-000000000005',
    null,
    'Paused until after the summer restructure. Archive for now rather than closing it out completely.',
    '2026-03-08T09:35:00Z',
    '2026-03-08T09:35:00Z'
  )
on conflict (id) do update
set
  intake_id = excluded.intake_id,
  author_id = excluded.author_id,
  body = excluded.body,
  created_at = excluded.created_at,
  updated_at = excluded.updated_at;

commit;
