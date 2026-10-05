import type { Metadata } from 'next';

import LegalLayout from '@/components/common/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms & Conditions — AURALITH PTE',
  description:
    'Terms & Conditions governing access to and use of AURALITH PTE, a PTE preparation and learning platform operated by Auralith Bit.',
};

/**
 * Blocks mirror the structure of the source document. Only the running
 * "AURALITH PTE - Terms & Conditions - Page N" headers were dropped, since
 * those are exporter page furniture rather than document content, and lines
 * that the PDF wrapped mid-sentence were rejoined into whole paragraphs.
 * No wording was changed.
 */
type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'h2'; text: string }
  | { kind: 'contact'; lines: string[] };

type Section = { id: number; title: string; blocks: Block[] };

const SECTIONS: Section[] = [
  {
    id: 1,
    title: 'About AURALITH PTE',
    blocks: [
      {
        kind: 'p',
        text: 'AURALITH PTE is an independent digital preparation platform operated by Auralith Bit and designed to help users prepare for English language proficiency examinations, including the Pearson Test of English (PTE).',
      },
      { kind: 'p', text: 'Depending on the features available, AURALITH PTE may provide:' },
      {
        kind: 'ul',
        items: [
          'PTE-style practice questions',
          'Reading practice',
          'Listening practice',
          'Speaking practice',
          'Writing practice',
          'Mock tests',
          'Practice assessments',
          'Automated or AI-assisted evaluation',
          'Estimated performance scores',
          'Vocabulary and grammar resources',
          'Study materials',
          'Progress tracking',
          'Performance analytics',
          'Personalized practice recommendations',
          'Practice history',
          'Learning dashboards',
          'Audio and speaking exercises',
          'Writing evaluation',
          'Educational videos and multimedia resources',
          'Paid courses and preparation packages',
          'Subscription services',
          'Certificates or completion acknowledgements, where applicable',
        ],
      },
      {
        kind: 'p',
        text: 'The features available to each user may depend on the applicable plan, subscription, package, account type, location, or other conditions.',
      },
    ],
  },
  {
    id: 2,
    title: 'Independent Platform and PTE Disclaimer',
    blocks: [
      {
        kind: 'p',
        text: 'AURALITH PTE is an independent PTE preparation platform operated by Auralith Bit.',
      },
      {
        kind: 'p',
        text: 'Auralith Bit and AURALITH PTE are not Pearson Education Limited, Pearson Test of English (PTE), or any Pearson-affiliated organization, unless expressly stated otherwise in writing. “Pearson”, “Pearson Test of English”, “PTE”, and related trademarks are the property of their respective owners.',
      },
      {
        kind: 'p',
        text: 'AURALITH PTE does not represent that it is an official Pearson examination platform, examination center, testing provider, or Pearson-authorized service unless such authorization is expressly stated and verifiable.',
      },
      {
        kind: 'p',
        text: 'AURALITH PTE provides preparation, practice, simulation, and educational resources.',
      },
      {
        kind: 'p',
        text: 'Users should refer to official Pearson resources for the latest information concerning official PTE examinations, registration, test dates, examination centers, official scoring, examination formats, rules, identification requirements, test policies, and official results.',
      },
    ],
  },
  {
    id: 3,
    title: 'Eligibility',
    blocks: [
      {
        kind: 'p',
        text: 'You must provide accurate and current information when creating an AURALITH PTE account. By using the Services, you confirm that:',
      },
      {
        kind: 'ul',
        items: [
          'The information you provide is accurate.',
          'You are legally permitted to use the Services.',
          'You will comply with these Terms.',
          'You will comply with applicable laws and regulations.',
          "You will not create an account using another person's identity without authorization.",
        ],
      },
      {
        kind: 'p',
        text: 'If you are under the applicable age of majority in your jurisdiction, use of AURALITH PTE may require parental or legal guardian involvement or consent where required by applicable law. Auralith Bit reserves the right to restrict or terminate an account where registration information is false, misleading, fraudulent, or unauthorized.',
      },
    ],
  },
  {
    id: 4,
    title: 'Account Registration',
    blocks: [
      {
        kind: 'p',
        text: 'Certain features of AURALITH PTE require an account. You are responsible for:',
      },
      {
        kind: 'ul',
        items: [
          'Providing accurate registration information.',
          'Keeping your login credentials confidential.',
          'Maintaining the security of your account.',
          'Not sharing your account with other individuals.',
          'Preventing unauthorized access to your account.',
          'Informing Auralith Bit if you believe your account has been compromised.',
        ],
      },
      {
        kind: 'p',
        text: 'Your account is intended for your individual use unless a separate institutional or group agreement applies. Auralith Bit may suspend or terminate accounts involved in unauthorized access, fraudulent activity, abuse, or violations of these Terms.',
      },
    ],
  },
  {
    id: 5,
    title: 'Personal Use',
    blocks: [
      {
        kind: 'p',
        text: 'Unless otherwise agreed in writing, AURALITH PTE is provided for your personal educational use. You must not:',
      },
      {
        kind: 'ul',
        items: [
          'Share your account credentials with another person.',
          'Sell or transfer your account.',
          'Resell access to AURALITH PTE.',
          'Share paid course content.',
          'Distribute restricted learning materials.',
          'Record or reproduce paid classes without permission.',
          'Provide subscription access to unauthorized users.',
          'Use AURALITH PTE to operate a competing commercial preparation service.',
        ],
      },
      {
        kind: 'p',
        text: 'Institutional, school, training-center, or group access may be provided under separate agreements.',
      },
    ],
  },
  {
    id: 6,
    title: 'AURALITH PTE Content',
    blocks: [
      {
        kind: 'p',
        text: 'AURALITH PTE may contain the following, collectively referred to as “Platform Content”:',
      },
      {
        kind: 'ul',
        items: [
          'Practice questions',
          'Mock tests',
          'Explanations',
          'Audio materials',
          'Videos',
          'Images',
          'Text',
          'Exercises',
          'Templates',
          'Learning resources',
          'Algorithms',
          'Software',
          'User interfaces',
          'Databases',
          'Performance analytics',
          'Reports',
          'Other educational materials',
        ],
      },
      {
        kind: 'p',
        text: 'Unless otherwise stated, Platform Content is owned by or licensed to Auralith Bit. You may use Platform Content only for your personal educational purposes and in accordance with these Terms. Without prior written permission, you must not copy Platform Content for commercial use, sell or redistribute it, publish it publicly, systematically download or scrape it, create a competing database using AURALITH PTE materials, modify and redistribute it, or remove copyright, trademark, or ownership notices.',
      },
    ],
  },
  {
    id: 7,
    title: 'Practice Questions and Mock Tests',
    blocks: [
      {
        kind: 'p',
        text: 'AURALITH PTE may provide practice questions and simulated examinations. These practice tests are intended for educational and preparation purposes only. They are not official Pearson PTE examinations.',
      },
      {
        kind: 'ul',
        items: [
          'Question content may differ.',
          'Question selection may differ.',
          'Difficulty may differ.',
          'Scoring methodology may differ.',
          'The test interface may differ.',
          'Examination conditions may differ.',
          'Question format may differ.',
          'Test rules and administration may differ.',
        ],
      },
      {
        kind: 'p',
        text: 'Auralith Bit does not guarantee that a question, topic, template, or exercise available on AURALITH PTE will appear on an official PTE examination.',
      },
    ],
  },
  {
    id: 8,
    title: 'Automated and AI-Assisted Evaluation',
    blocks: [
      {
        kind: 'p',
        text: 'AURALITH PTE may use automated systems, artificial intelligence, algorithms, or machine-learning technologies to provide educational feedback. Depending on the feature, automated evaluation may analyze:',
      },
      {
        kind: 'ul',
        items: [
          'Pronunciation',
          'Fluency',
          'Grammar',
          'Vocabulary',
          'Written responses',
          'Content',
          'Sentence structure',
          'Response organization',
          'Other measurable characteristics',
        ],
      },
      {
        kind: 'p',
        text: "Automated evaluation is provided as a learning and preparation aid. Automated results may occasionally be inaccurate, incomplete, inconsistent, or different from official examination scoring. Any score, estimate, assessment, or recommendation generated by AURALITH PTE is not an official PTE score. Users must not represent an AURALITH PTE-generated score as an official Pearson examination result. Auralith Bit does not guarantee that an automated assessment will predict an individual's actual PTE examination score.",
      },
    ],
  },
  {
    id: 9,
    title: 'No Guaranteed Examination Result',
    blocks: [
      {
        kind: 'p',
        text: 'AURALITH PTE provides preparation resources but does not guarantee:',
      },
      {
        kind: 'ul',
        items: [
          'A particular PTE score.',
          'A particular score improvement.',
          'A passing result.',
          'Admission to an educational institution.',
          'Visa approval.',
          'Immigration approval.',
          'Employment.',
          'Scholarship approval.',
          'Any other result dependent on an external examination, organization, institution, government authority, or third party.',
        ],
      },
      {
        kind: 'p',
        text: "Individual results depend on many factors, including preparation, prior knowledge, practice, examination performance, examination conditions, and other circumstances outside Auralith Bit's control.",
      },
    ],
  },
  {
    id: 10,
    title: 'User-Submitted Content',
    blocks: [
      { kind: 'p', text: 'AURALITH PTE may allow users to submit content, including:' },
      {
        kind: 'ul',
        items: [
          'Written answers',
          'Essays',
          'Speaking responses',
          'Audio recordings',
          'Practice responses',
          'Questions',
          'Feedback',
          'Comments',
          'Other educational submissions',
        ],
      },
      {
        kind: 'p',
        text: "You retain ownership of your content to the extent provided by applicable law. By submitting content to AURALITH PTE, you grant Auralith Bit the rights reasonably necessary to store, process, evaluate, generate feedback or analytics, display the submission within your account, provide the requested Services, and maintain and improve relevant functionality. Where submitted content is used for product improvement, quality assurance, research, or system development, it will be handled in accordance with the applicable Privacy Policy and applicable law. You must not submit content that infringes another person's copyright, privacy, intellectual-property rights, or other legal rights.",
      },
    ],
  },
  {
    id: 11,
    title: 'Speaking Recordings and Audio Data',
    blocks: [
      {
        kind: 'p',
        text: 'Certain AURALITH PTE features may require users to submit voice or audio recordings. These recordings may be processed for:',
      },
      {
        kind: 'ul',
        items: [
          'Pronunciation analysis',
          'Fluency analysis',
          'Speaking feedback',
          'Automated evaluation',
          'Performance tracking',
          'Practice history',
        ],
      },
      {
        kind: 'p',
        text: 'Users should review the AURALITH PTE Privacy Policy for information about how recordings and related personal data are collected, processed, stored, and handled. Users should not submit unnecessary sensitive personal information in speaking responses or other practice materials.',
      },
    ],
  },
  {
    id: 12,
    title: 'User Conduct',
    blocks: [
      {
        kind: 'p',
        text: 'You agree to use AURALITH PTE lawfully and responsibly. You must not:',
      },
      {
        kind: 'ul',
        items: [
          "Attempt to access another user's account.",
          'Circumvent subscription restrictions.',
          'Bypass authentication or security controls.',
          'Introduce malware, viruses, or harmful code.',
          'Attempt to disrupt the Platform.',
          'Scrape or systematically extract Platform data.',
          'Use unauthorized bots or automated systems.',
          'Manipulate scores, rankings, or progress information.',
          'Upload unlawful or harmful content.',
          'Impersonate another person or organization.',
          'Use the Platform for fraudulent purposes.',
          'Resell Platform access without authorization.',
          'Attempt to bypass payment requirements.',
          'Abuse other users or support personnel.',
          'Reverse engineer proprietary Platform systems except where expressly permitted by applicable law.',
          'Use AURALITH PTE materials to create a competing commercial service.',
          'Attempt to obtain restricted content through unauthorized means.',
        ],
      },
      {
        kind: 'p',
        text: 'Violation of these rules may result in suspension or termination of access.',
      },
    ],
  },
  {
    id: 13,
    title: 'Payments and Purchases',
    blocks: [
      {
        kind: 'p',
        text: 'Certain AURALITH PTE Services may require payment. Before completing a purchase, users will be provided with applicable information regarding:',
      },
      {
        kind: 'ul',
        items: [
          'Product or subscription price',
          'Subscription duration',
          'Included features',
          'Applicable taxes, where relevant',
          'Payment method',
          'Renewal terms, where applicable',
        ],
      },
      {
        kind: 'p',
        text: 'Prices may change in the future. Changes generally apply to future purchases or renewals unless otherwise required by applicable law. Auralith Bit may use third-party payment providers to process transactions. Payment providers may have their own terms and privacy policies.',
      },
    ],
  },
  {
    id: 14,
    title: 'Subscriptions',
    blocks: [
      { kind: 'p', text: 'Where AURALITH PTE offers subscription plans:' },
      {
        kind: 'ul',
        items: [
          'Access will be provided according to the purchased plan.',
          'Different plans may contain different features.',
          'Subscription access may expire at the end of the applicable period.',
          'Account sharing may result in restrictions.',
          'Reasonable usage limits may be implemented to prevent abuse.',
          'Subscription features may be modified or updated over time.',
        ],
      },
      {
        kind: 'p',
        text: 'If automatic renewal is offered, applicable renewal terms will be displayed during the purchase process.',
      },
    ],
  },
  {
    id: 15,
    title: 'Refunds and Cancellation',
    blocks: [
      { kind: 'p', text: 'Refund eligibility may depend on:' },
      {
        kind: 'ul',
        items: [
          'Product type',
          'Subscription plan',
          'Date of purchase',
          'Usage of the Service',
          'Promotional pricing',
          'Technical issues',
          'Duplicate transactions',
          'Applicable laws and regulations',
          'Any separate refund policy',
        ],
      },
      {
        kind: 'p',
        text: 'Refund requests should be submitted through the official Auralith Bit support channel. Where a separate Refund & Cancellation Policy applies to a particular purchase, that policy will govern the relevant refund process. Nothing in this section limits mandatory consumer rights provided by applicable law.',
      },
    ],
  },
  {
    id: 16,
    title: 'Free Trials and Promotional Offers',
    blocks: [
      { kind: 'p', text: 'AURALITH PTE may provide:' },
      {
        kind: 'ul',
        items: [
          'Free trials',
          'Promotional subscriptions',
          'Discount codes',
          'Referral benefits',
          'Limited-time access',
          'Special offers',
        ],
      },
      {
        kind: 'p',
        text: 'Promotional offers may have additional terms, eligibility requirements, usage restrictions, and expiration dates. Auralith Bit reserves the right to withdraw or modify promotional offers where permitted by applicable law. Users must not create multiple accounts for the purpose of abusing promotional offers.',
      },
    ],
  },
  {
    id: 17,
    title: 'Platform Availability',
    blocks: [
      {
        kind: 'p',
        text: 'Auralith Bit aims to provide a reliable and accessible service but does not guarantee uninterrupted availability. AURALITH PTE may occasionally be unavailable because of:',
      },
      {
        kind: 'ul',
        items: [
          'Scheduled maintenance',
          'Software updates',
          'Server problems',
          'Security incidents',
          'Internet failures',
          'Telecommunications problems',
          'Third-party service interruptions',
          'Natural disasters',
          'Government restrictions',
          'Other circumstances beyond reasonable control',
        ],
      },
      {
        kind: 'p',
        text: 'Auralith Bit may modify, suspend, or discontinue particular features when reasonably necessary.',
      },
    ],
  },
  {
    id: 18,
    title: 'Accuracy of Information',
    blocks: [
      {
        kind: 'p',
        text: 'Auralith Bit makes reasonable efforts to provide useful and accurate educational content. However, information, learning materials, test-related information, software features, and other Platform Content may contain errors or become outdated.',
      },
      {
        kind: 'p',
        text: 'Auralith Bit does not guarantee that all Platform Content will always be complete, accurate, current, error-free, or suitable for every learner. Information relating to official PTE examinations should be verified through official Pearson resources.',
      },
    ],
  },
  {
    id: 19,
    title: 'Intellectual Property',
    blocks: [
      {
        kind: 'p',
        text: 'AURALITH PTE and its underlying technology, software, design, user interface, databases, educational content, graphics, logos, branding, and other proprietary materials may be protected by copyright, trademark, database rights, and other intellectual-property laws.',
      },
      {
        kind: 'p',
        text: "Nothing in these Terms transfers ownership of Auralith Bit's intellectual property to you. You receive only a limited, non-exclusive, non-transferable right to use the Services in accordance with these Terms.",
      },
    ],
  },
  {
    id: 20,
    title: 'AURALITH PTE and Auralith Bit Branding',
    blocks: [
      {
        kind: 'p',
        text: 'AURALITH PTE, Auralith Bit, associated logos, product names, designs, and branding may constitute trademarks or proprietary assets of Auralith Bit. You must not use these marks in a manner that:',
      },
      {
        kind: 'ul',
        items: [
          'Suggests unauthorized affiliation.',
          'Suggests endorsement.',
          'Misrepresents your relationship with Auralith Bit.',
          'Uses Auralith Bit branding commercially without permission.',
        ],
      },
    ],
  },
  {
    id: 21,
    title: 'Third-Party Services',
    blocks: [
      { kind: 'p', text: 'AURALITH PTE may integrate with third-party services, including:' },
      {
        kind: 'ul',
        items: [
          'Payment providers',
          'Authentication services',
          'Cloud services',
          'Analytics services',
          'Communication services',
          'AI services',
          'Hosting providers',
          'Other external platforms',
        ],
      },
      {
        kind: 'p',
        text: 'Third-party services may have their own terms and privacy policies. Auralith Bit does not control third-party services and is not responsible for their content, policies, availability, security, or functionality except where liability cannot legally be excluded.',
      },
    ],
  },
  {
    id: 22,
    title: 'Privacy and Personal Data',
    blocks: [
      {
        kind: 'p',
        text: 'Auralith Bit may collect and process information necessary to provide AURALITH PTE Services. Depending on the features used, information may include:',
      },
      {
        kind: 'ul',
        items: [
          'Name',
          'Email address',
          'Account information',
          'Login information',
          'Learning progress',
          'Test attempts',
          'Practice scores',
          'Performance information',
          'Written responses',
          'Audio recordings',
          'Feedback',
          'Device information',
          'Technical information',
          'Payment-related information processed through payment providers',
        ],
      },
      {
        kind: 'p',
        text: 'Personal data will be handled in accordance with the applicable AURALITH PTE Privacy Policy and applicable law. Users should not submit unnecessary sensitive personal information through practice responses, comments, or other Platform features.',
      },
    ],
  },
  {
    id: 23,
    title: 'Account and Data Security',
    blocks: [
      {
        kind: 'p',
        text: 'Auralith Bit takes reasonable technical and organizational measures to protect Platform information. However, no internet-based service can guarantee absolute security.',
      },
      {
        kind: 'p',
        text: 'Users are responsible for protecting their passwords, securing their devices, avoiding unauthorized account sharing, and reporting suspected account compromise. If you identify a security vulnerability or unauthorized access involving AURALITH PTE, you should notify Auralith Bit promptly through the official contact channel.',
      },
    ],
  },
  {
    id: 24,
    title: 'Account Suspension and Termination',
    blocks: [
      {
        kind: 'p',
        text: 'Auralith Bit may suspend, restrict, or terminate access where reasonably necessary, including when a user:',
      },
      {
        kind: 'ul',
        items: [
          'Violates these Terms.',
          'Engages in fraudulent activity.',
          'Shares paid access improperly.',
          'Attempts unauthorized access.',
          'Abuses Platform systems.',
          'Infringes intellectual-property rights.',
          'Uses the Platform unlawfully.',
          'Attempts to circumvent payment or access restrictions.',
          'Uses automated methods to abuse the Platform.',
        ],
      },
      {
        kind: 'p',
        text: 'Where appropriate and legally required, Auralith Bit may provide notice before termination. Certain provisions of these Terms may continue to apply after termination, including provisions concerning intellectual property, liability, prohibited use, and dispute resolution.',
      },
    ],
  },
  {
    id: 25,
    title: 'Disclaimer of Warranties',
    blocks: [
      {
        kind: 'p',
        text: 'To the maximum extent permitted by applicable law, AURALITH PTE is provided on an “as available” and “as is” basis. Auralith Bit does not guarantee that:',
      },
      {
        kind: 'ul',
        items: [
          'The Platform will always be available.',
          'The Platform will be completely error-free.',
          'All content will always be accurate or current.',
          'Automated scoring will exactly match official examination scoring.',
          "The Platform will meet every user's individual expectations.",
          'Use of the Platform will result in a particular examination score.',
          'Practice results will accurately predict official examination results.',
        ],
      },
      {
        kind: 'p',
        text: 'Nothing in these Terms excludes statutory rights or warranties that cannot legally be excluded.',
      },
    ],
  },
  {
    id: 26,
    title: 'Limitation of Liability',
    blocks: [
      {
        kind: 'p',
        text: 'To the maximum extent permitted by applicable law, Auralith Bit will not be responsible for losses arising from:',
      },
      {
        kind: 'ul',
        items: [
          'Failure to achieve a particular PTE score.',
          'Reliance on estimated or automated scores.',
          'Official examination results.',
          'Changes to official PTE policies or examination formats.',
          'Third-party service interruptions.',
          'User account sharing.',
          'User credential misuse.',
          "Internet or device failures outside Auralith Bit's reasonable control.",
          "Unauthorized access resulting from the user's failure to secure their account.",
          'Indirect or consequential losses where such exclusion is legally permitted.',
        ],
      },
      {
        kind: 'p',
        text: 'Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited.',
      },
    ],
  },
  {
    id: 27,
    title: 'Indemnification',
    blocks: [
      {
        kind: 'p',
        text: 'To the extent permitted by applicable law, you agree to be responsible for claims, losses, liabilities, damages, and reasonable expenses arising from your:',
      },
      {
        kind: 'ul',
        items: [
          'Violation of these Terms.',
          'Unlawful use of AURALITH PTE.',
          "Unauthorized use of another person's account.",
          'Infringement of third-party rights.',
          'Misuse of Platform Content.',
        ],
      },
      {
        kind: 'p',
        text: 'This provision applies only to the extent permitted by applicable law.',
      },
    ],
  },
  {
    id: 28,
    title: 'Changes to AURALITH PTE',
    blocks: [
      {
        kind: 'p',
        text: 'Auralith Bit may update, modify, add, or remove features from AURALITH PTE from time to time. Changes may include:',
      },
      {
        kind: 'ul',
        items: [
          'Dashboard functionality',
          'User interface',
          'Practice content',
          'Mock tests',
          'Scoring systems',
          'AI evaluation features',
          'Analytics',
          'Subscription packages',
          'Learning resources',
          'Technical infrastructure',
        ],
      },
      {
        kind: 'p',
        text: 'Auralith Bit may introduce new features or discontinue features that are no longer technically, commercially, or operationally viable.',
      },
    ],
  },
  {
    id: 29,
    title: 'Changes to These Terms',
    blocks: [
      {
        kind: 'p',
        text: 'Auralith Bit may update these Terms from time to time. For material changes, Auralith Bit may provide notice through reasonable means, including:',
      },
      {
        kind: 'ul',
        items: [
          'Website notifications',
          'Dashboard notifications',
          'Email',
          'Other appropriate communication',
        ],
      },
      {
        kind: 'p',
        text: 'The updated Terms will be published with a revised “Last Updated” date. Where permitted by applicable law, continued use of AURALITH PTE after the effective date of revised Terms constitutes acceptance of the updated Terms.',
      },
    ],
  },
  {
    id: 30,
    title: 'Governing Law and Dispute Resolution',
    blocks: [
      {
        kind: 'p',
        text: 'These Terms shall be governed by the laws applicable in Nepal, unless mandatory applicable law provides otherwise.',
      },
      {
        kind: 'p',
        text: 'Users should first contact Auralith Bit to attempt to resolve any dispute, complaint, or concern through good-faith communication. If a dispute cannot be resolved through reasonable communication, it may be subject to the jurisdiction of the competent courts of Nepal. Nothing in this section removes any mandatory consumer rights or legal remedies available under applicable law.',
      },
    ],
  },
  {
    id: 31,
    title: 'Severability',
    blocks: [
      {
        kind: 'p',
        text: 'If any provision of these Terms is determined to be invalid, unlawful, or unenforceable, that provision will be interpreted or modified to the minimum extent necessary to make it enforceable. The remaining provisions will continue to apply to the extent permitted by law.',
      },
    ],
  },
  {
    id: 32,
    title: 'No Waiver',
    blocks: [
      {
        kind: 'p',
        text: 'If Auralith Bit does not immediately enforce any provision of these Terms, that does not constitute a permanent waiver of its right to enforce that provision in the future.',
      },
    ],
  },
  {
    id: 33,
    title: 'Entire Agreement',
    blocks: [
      { kind: 'p', text: 'These Terms, together with the applicable:' },
      {
        kind: 'ul',
        items: [
          'Privacy Policy',
          'Refund & Cancellation Policy',
          'Cookie Policy',
          'Subscription Terms',
          'Acceptable Use Policy',
          'Other policies expressly incorporated into AURALITH PTE',
        ],
      },
      {
        kind: 'p',
        text: 'constitute the agreement governing your use of the applicable Services. Additional terms may apply to specific products, subscriptions, courses, or services. Where a specific agreement conflicts with these Terms, the specific agreement will apply to the extent of the conflict.',
      },
    ],
  },
  {
    id: 34,
    title: 'Contact Information',
    blocks: [
      {
        kind: 'p',
        text: 'For questions, complaints, refund requests, account-related issues, security concerns, or other matters relating to AURALITH PTE, please contact:',
      },
      {
        kind: 'contact',
        lines: [
          'Auralith Bit',
          'Platform: AURALITH PTE',
          'Website: auralithbit.com.np',
          'Email: info@auralithbit.com.np',
          'Address: SNP-05, Milan Chowk, Bhairahawa, Nepal',
        ],
      },
    ],
  },
  {
    id: 35,
    title: 'Acceptance of Terms',
    blocks: [
      {
        kind: 'p',
        text: 'By creating an account, purchasing a subscription, accessing, or using AURALITH PTE, you acknowledge that:',
      },
      {
        kind: 'ul',
        items: [
          'You have read these Terms & Conditions.',
          'You understand the terms applicable to your use of AURALITH PTE.',
          'You agree to comply with these Terms.',
          'You understand that AURALITH PTE is an independent PTE preparation platform.',
          'You understand that AURALITH PTE is not the official Pearson PTE examination provider.',
          'You understand that AURALITH PTE practice scores and automated assessments are not official PTE scores.',
          'You understand that Auralith Bit does not guarantee a particular examination result.',
        ],
      },
    ],
  },
];

const PLATFORM_INFORMATION = {
  title: 'Platform Information',
  rows: [
    { label: 'Platform', value: 'AURALITH PTE' },
    { label: 'Operated by', value: 'Auralith Bit' },
    { label: 'Address', value: 'SNP-05, Milan Chowk, Bhairahawa, Nepal' },
    { label: 'Website', value: 'auralithbit.com.np' },
    { label: 'Email', value: 'info@auralithbit.com.np' },
    { label: 'Last Updated', value: '2083/06/05' },
  ],
  copyright: '© 2083 Auralith Bit. All rights reserved.',
};

function BlockView({ block }: { block: Block }) {
  if (block.kind === 'p') {
    return <p className="legal-p">{block.text}</p>;
  }

  if (block.kind === 'ul') {
    return (
      <ul className="legal-ul">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  if (block.kind === 'h2') {
    return <h2 className="legal-h2">{block.text}</h2>;
  }

  return (
    <div className="legal-contact">
      {block.lines.map((line, index) =>
        index === 0 ? (
          <p key={line} className="legal-contact-name">
            {line}
          </p>
        ) : (
          <p key={line} className="legal-contact-line">
            {line}
          </p>
        ),
      )}
    </div>
  );
}

export default function TermsPage() {
  return (
    <LegalLayout>
      <header className="legal-header">
        <p className="legal-brand">AURALITH PTE</p>
        <h1 className="legal-title">TERMS &amp; CONDITIONS</h1>
        <p className="legal-subtitle">Operated by Auralith Bit</p>
        <p className="legal-updated">Last Updated: 2083/06/05</p>
      </header>

      <div className="legal-intro">
        <p className="legal-p">
          Welcome to AURALITH PTE, a PTE preparation and learning platform operated by Auralith
          Bit (“Auralith Bit”, “we”, “us”, or “our”). These Terms &amp; Conditions (“Terms”)
          govern your access to and use of AURALITH PTE, including its website, user dashboard,
          practice tests, mock examinations, learning materials, assessments, performance
          analytics, subscriptions, and related services (collectively, the “Services”).
        </p>
        <p className="legal-p">
          By creating an account, accessing, purchasing, or using any part of AURALITH PTE, you
          acknowledge that you have read, understood, and agreed to these Terms. If you do not
          agree with these Terms, you must not use the Services.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.id} className="legal-section">
          <h2 className="legal-h2">
            {section.id}. {section.title}
          </h2>
          {section.blocks.map((block, index) => (
            <BlockView key={`${section.id}-${index}`} block={block} />
          ))}
        </section>
      ))}

      <section className="legal-section legal-section--panel">
        <h2 className="legal-h2">{PLATFORM_INFORMATION.title}</h2>
        <dl className="legal-panel">
          {PLATFORM_INFORMATION.rows.map((row) => (
            <div key={row.label} className="legal-panel-row">
              <dt className="legal-panel-label">{row.label}:</dt>
              <dd className="legal-panel-value">{row.value}</dd>
            </div>
          ))}
        </dl>
        <p className="legal-copyright">{PLATFORM_INFORMATION.copyright}</p>
      </section>
    </LegalLayout>
  );
}
