export interface ToolExample {
    toolSlug: string;
    exampleSlug: string;
    state: any;
    title: string;
    metaDescription: string;
    h1: string;
    paragraph: string;
    relatedLinks: { url: string; title: string }[];
    faq: { question: string; answer: string }[];
}

export const EXAMPLES: ToolExample[] = [
    // CRON
    {
        toolSlug: 'cron',
        exampleSlug: 'every-15-minutes',
        state: { cron: '*/15 * * * *' },
        title: 'Cron: every 15 minutes — translator + next run times | CyberScryb',
        metaDescription: 'Translate the cron expression */15 * * * * into human-readable text. See the exact next 5 execution times instantly in your browser.',
        h1: 'Cron expression: every 15 minutes',
        paragraph: 'Running a task every 15 minutes is the standard heartbeat for monitoring scripts, queue workers, and background syncs. It uses the step value */15 to execute at 0, 15, 30, and 45 minutes past the hour. This guarantees regular intervals without overloading the system.',
        relatedLinks: [
            { url: '/tools/cron/examples/every-5-minutes', title: 'Every 5 minutes' },
            { url: '/tools/cron/examples/every-hour', title: 'Every hour' }
        ],
        faq: [
            { question: 'What does */15 mean in cron?', answer: 'It means "every 15th minute". It is effectively a step value that matches minutes 0, 15, 30, and 45.' },
            { question: 'Is every 15 minutes too frequent for API polling?', answer: 'It depends on the API rate limit, but generally 15 minutes is a safe and polite polling interval for non-realtime services.' }
        ]
    },
    {
        toolSlug: 'cron',
        exampleSlug: 'every-hour',
        state: { cron: '0 * * * *' },
        title: 'Cron: every hour — translator + next run times | CyberScryb',
        metaDescription: 'Understand the standard hourly cron expression 0 * * * *. Convert it to plain English and calculate upcoming run times.',
        h1: 'Cron expression: every hour',
        paragraph: 'An hourly cron job is configured by setting the minute field to exactly 0 while using wildcards for the remaining fields. It’s perfect for rotating logs, taking incremental snapshots, or compiling hourly metrics.',
        relatedLinks: [
            { url: '/tools/cron/examples/every-15-minutes', title: 'Every 15 minutes' },
            { url: '/tools/cron/examples/every-weekday-at-9am', title: 'Every weekday at 9am' }
        ],
        faq: [
            { question: 'Why use 0 instead of * for the minute field?', answer: 'Using * for the minute field means the job runs every single minute. To run exactly once an hour, you must fix the minute to 0.' }
        ]
    },
    {
        toolSlug: 'cron',
        exampleSlug: 'every-weekday-at-9am',
        state: { cron: '0 9 * * 1-5' },
        title: 'Cron: every weekday at 9am — translator + schedules | CyberScryb',
        metaDescription: 'Visualize the cron configuration 0 9 * * 1-5 for weekday executions. Great for scheduled reports or team notifications.',
        h1: 'Cron expression: every weekday at 9am',
        paragraph: 'This expression ensures a job runs cleanly at the start of the business day from Monday through Friday. It’s the canonical pattern for daily standup reminders or morning status digests.',
        relatedLinks: [
            { url: '/tools/cron/examples/every-monday', title: 'Every Monday' },
            { url: '/tools/cron/examples/every-hour', title: 'Every hour' }
        ],
        faq: [
            { question: 'Does 1 mean Monday or Sunday?', answer: 'In standard cron, 1 means Monday and 5 means Friday. 0 and 7 typically represent Sunday.' }
        ]
    },
    {
        toolSlug: 'cron',
        exampleSlug: 'every-monday',
        state: { cron: '0 0 * * 1' },
        title: 'Cron: every Monday — translator + scheduled runs | CyberScryb',
        metaDescription: 'Evaluate 0 0 * * 1 to trigger jobs strictly on Mondays at midnight.',
        h1: 'Cron expression: every Monday',
        paragraph: 'By tying the execution strictly to the first day of the week (1), this job ensures weekly reports or major database maintenance tasks kick off at exactly midnight Monday morning.',
        relatedLinks: [
            { url: '/tools/cron/examples/every-weekday-at-9am', title: 'Every weekday 9am' }
        ],
        faq: [
            { question: 'What time does this run?', answer: 'It runs at exactly 00:00 (midnight) in the server’s local timezone on Monday morning.' }
        ]
    },
    {
        toolSlug: 'cron',
        exampleSlug: 'first-of-the-month',
        state: { cron: '0 0 1 * *' },
        title: 'Cron: first of the month — run times + testing | CyberScryb',
        metaDescription: 'Test and confirm the 0 0 1 * * cron expression for billing cycles and monthly batch jobs.',
        h1: 'Cron expression: first of the month',
        paragraph: 'This pattern binds execution to the 1st day of every month at midnight. If you are generating monthly invoices or resetting quotas, this is the exact string you need.',
        relatedLinks: [
            { url: '/tools/cron/examples/every-monday', title: 'Every Monday' },
            { url: '/tools/cron/examples/midnight-daily', title: 'Midnight daily' }
        ],
        faq: [
            { question: 'Will this account for leap years?', answer: 'Yes, setting the day of the month to 1 is completely agnostic to the length of the previous month.' }
        ]
    },
    {
        toolSlug: 'cron',
        exampleSlug: 'every-5-minutes',
        state: { cron: '*/5 * * * *' },
        title: 'Cron: every 5 minutes — expression translator | CyberScryb',
        metaDescription: 'Ensure high-frequency scripts execute correctly using */5 * * * *.',
        h1: 'Cron expression: every 5 minutes',
        paragraph: 'Five-minute intervals are the sweet spot for health checks and fast syncing without completely spamming an architecture. It uses the step modifier to evenly divide the hour.',
        relatedLinks: [
            { url: '/tools/cron-builder/examples/every-15-minutes', title: 'Every 15 minutes' }
        ],
        faq: [
            { question: 'Is using */5 better than listing 0,5,10,15... ?', answer: 'Yes, using the step modifier is significantly more readable and less prone to typos.' }
        ]
    },
    {
        toolSlug: 'cron',
        exampleSlug: 'midnight-daily',
        state: { cron: '0 0 * * *' },
        title: 'Cron: midnight daily — 0 0 * * * schedule tester | CyberScryb',
        metaDescription: 'Quickly verify standard daily database backup schedules operating at midnight.',
        h1: 'Cron expression: midnight daily',
        paragraph: 'The quintessential daily cron. By zeroing out the minute and hour fields, it fires exactly when the calendar rolls over. Crucial for heavy compute tasks that require low user activity.',
        relatedLinks: [
            { url: '/tools/cron/examples/first-of-the-month', title: 'First of the month' }
        ],
        faq: [
            { question: 'Which midnight is it?', answer: 'Cron evaluates against the system time of the server running the cron daemon. It is usually UTC for cloud servers.' }
        ]
    },

    // REGEX
    {
        toolSlug: 'regex',
        exampleSlug: 'match-email',
        state: { regex: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b', flags: 'g', testStr: 'Contact support@example.com or admin@test-domain.org for help. Ignore invalid@emails.' },
        title: 'Regex: match valid email addresses | CyberScryb',
        metaDescription: 'A robust regular expression to test, match, and extract valid email addresses from blocks of text.',
        h1: 'Regex pattern: extract email addresses',
        paragraph: 'Email validation logic is notoriously tricky. This pattern reliably extracts well-formed addresses without catching trailing punctuation or falling victim to catastrophic backtracking on edge cases.',
        relatedLinks: [
            { url: '/tools/regex/examples/match-url', title: 'Match URLs' }
        ],
        faq: [
            { question: 'Does this comply with the RFC 5322 standard?', answer: 'No regex truly complies with RFC 5322 flawlessly. This is a practical subset that covers 99.9% of real-world use cases safely.' }
        ]
    },
    {
        toolSlug: 'regex',
        exampleSlug: 'match-url',
        state: { regex: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)', flags: 'g', testStr: 'Visit https://cyberscryb.com or http://sub.example.co.uk/path?q=1 for more.' },
        title: 'Regex: safely match and execute URLs | CyberScryb',
        metaDescription: 'Regular expression to identify and extract HTTP and HTTPS URLs from raw strings.',
        h1: 'Regex pattern: URL extraction',
        paragraph: 'Extracting links from raw text blocks requires handling optional secure protocols, unpredictable subdomains, and highly variable query parameters. This Regex structure locks onto the protocol and domain boundary safely.',
        relatedLinks: [
            { url: '/tools/regex/examples/match-ipv4', title: 'Match IPv4' }
        ],
        faq: [
            { question: 'Will this match IPs as URLs?', answer: 'This specific expression is tailored for domain names. To strictly match IPs, use an IPv4 pattern.' }
        ]
    },
    {
        toolSlug: 'regex',
        exampleSlug: 'match-ipv4',
        state: { regex: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g', testStr: 'Server A is at 192.168.1.1 and Server B is at 10.0.0.255. Invalid IP: 256.0.0.1.' },
        title: 'Regex: precisely match IPv4 addresses | CyberScryb',
        metaDescription: 'A strict IPv4 regular expression that prevents invalid octets like 256 or 999 from matching.',
        h1: 'Regex pattern: IPv4 Addresses',
        paragraph: 'You can\'t just match \\d{1,3}\\. blindly, or you\'ll match 999.999.999.999. This pattern forces each octet to be logically evaluated between 0 and 255. It’s essential for parsing server logs securely.',
        relatedLinks: [
            { url: '/tools/regex/examples/match-url', title: 'Match URLs' }
        ],
        faq: [
            { question: 'Why is it so long?', answer: 'Because it must explicitly define character ranges for 0-199, 200-249, and 250-255 independently to avoid matching invalid numbers.' }
        ]
    },
    {
        toolSlug: 'regex',
        exampleSlug: 'match-uuid',
        state: { regex: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}', flags: 'g', testStr: 'User ID: 123e4567-e89b-12d3-a456-426614174000 has logged in.' },
        title: 'Regex: match UUIDs and GUIDs | CyberScryb',
        metaDescription: 'Extract 128-bit UUIDs/GUIDs from logs and payloads flawlessly.',
        h1: 'Regex pattern: match Universal Unique Identifiers',
        paragraph: 'UUIDs strictly follow an 8-4-4-4-12 hex structure. This regex validates the format quickly, making it perfect for sanitizing routing parameters or parsing messy debug traces.',
        relatedLinks: [
            { url: '/tools/regex/examples/match-semver', title: 'Match SemVer' }
        ],
        faq: [
            { question: 'Does this validate which Version the UUID is?', answer: 'No, this accepts all valid hex formats. UUIDv4 specifies a 4 in the 13th character, which this regex does not strictly enforce.' }
        ]
    },
    {
        toolSlug: 'regex',
        exampleSlug: 'match-semver',
        state: { regex: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$', flags: 'gm', testStr: '1.0.0\n2.1.0-alpha.1\n0.5.2+build.2023\ninvalid-1.0\n1.2' },
        title: 'Regex: Semantic Versioning (SemVer) | CyberScryb',
        metaDescription: 'The official Regex pattern to correctly identify SemVer compliance.',
        h1: 'Regex pattern: SemVer 2.0.0 compliance',
        paragraph: 'Semantic Versioning is incredibly precise. This pattern handles major, minor, patch formats, alongside pre-release and build metadata annotations seamlessly.',
        relatedLinks: [
            { url: '/tools/regex/examples/match-uuid', title: 'Match UUIDs' }
        ],
        faq: [
            { question: 'Can it match a version without a patch number like 1.0?', answer: 'No. Strict SemVer requires exactly three segments: MAJOR.MINOR.PATCH.' }
        ]
    },

    // JWT
    {
        toolSlug: 'jwt',
        exampleSlug: 'decode-hs256',
        state: { input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' },
        title: 'JWT Token: Decode HS256 algorithm securely | CyberScryb',
        metaDescription: 'A playground example of exploring an HMAC SHA-256 signed JSON Web Token locally in your browser.',
        h1: 'Decode HS256 JWT Token',
        paragraph: 'HS256 (HMAC with SHA-256) is a symmetric algorithm requiring the same secret to sign and verify. It is the most common algorithm for lightweight internal tokens. Explore its unencrypted payload visually.',
        relatedLinks: [
            { url: '/tools/jwt/examples/decode-rs256', title: 'Decode RS256' }
        ],
        faq: [
            { question: 'Is the data in this token encrypted?', answer: 'No. Standard JWT payloads are merely Base64-encoded, completely readable by anyone who encounters the token.' }
        ]
    },
    {
        toolSlug: 'jwt',
        exampleSlug: 'decode-rs256',
        state: { input: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InB1YmxpYy1rZXktaWQifQ.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJzdXBlcnVzZXIiLCJleHAiOjI5OTk5OTk5OTl9.signature_placeholder_because_rsa_signatures_are_massive' },
        title: 'JWT Token: Examining an RS256 token structure | CyberScryb',
        metaDescription: 'Dive into an RS256 token payload. Note the \'kid\' header which dictates public key rotation for verification.',
        h1: 'Decode RS256 Asymmetric JWT Token',
        paragraph: 'RS256 uses an asymmetric key pair. The token is signed via a private key by the issuer, but verified via a public key by the clients. It is vastly superior for zero-trust microservices.',
        relatedLinks: [
            { url: '/tools/jwt/examples/decode-hs256', title: 'Decode HS256' }
        ],
        faq: [
            { question: 'What does the kid header do?', answer: 'The "Key ID" signals to the receiving server exactly which public key out of a JWKS (JSON Web Key Set) it needs to fetch to verify the signature.' }
        ]
    },
    {
        toolSlug: 'jwt',
        exampleSlug: 'check-expiration',
        state: { input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTk5IiwiZXhwIjoxNDAwMDAwMDAwfQ.invalid' },
        title: 'JWT Token: Expired payload inspection | CyberScryb',
        metaDescription: 'Observe how custom UI highlights that a JWT token is expired based on its "exp" Unix timestamp claim.',
        h1: 'Inspect an Expired JWT Token',
        paragraph: 'Tokens without expirations are ticking security time bombs. This token utilizes the \'exp\' claim natively built into the JWT specification. When you decode it, notice how the timestamp is evaluated immediately.',
        relatedLinks: [
            { url: '/tools/jwt/examples/decode-hs256', title: 'Decode HS256' }
        ],
        faq: [
            { question: 'How is exp measured?', answer: 'The exp claim is strictly measured in seconds since the Unix Epoch (January 1, 1970 UTC).' }
        ]
    }
];
