export interface ExperienceItem {
    kind: 'internship' | 'education';
    title: string;
    /** Organisation, place and dates, shown as one mono line */
    meta: string;
    /** Short period shown on its own in compact lists; empty when unknown */
    period: string;
    text: string;
}

export const experience: ExperienceItem[] = [
    {
        kind: 'internship',
        title: 'BeeSafe: IoT & Embedded AI Intern',
        meta: 'Learning, Data & Robotics (LDR) Lab, ESIEA Paris · Apr – Aug 2026',
        period: 'Apr – Aug 2026',
        text: 'Built a complete sensor-to-screen smart beehive monitoring system: Node.js/MongoDB containerized backend, React Native mobile app with real-time SSE telemetry, on-device YOLO11s queen detection with temporal voting, and a two-stage U-Net heatmap frame analysis pipeline running fully offline.',
    },
    {
        kind: 'internship',
        title: 'C2I Group: Full-Stack & Secure Communication Intern',
        meta: 'C2I Group · Internship',
        period: '',
        text: 'Developed AES-encrypted and Base64-encoded secure data communication pipelines, implemented an MQTT telemetry publisher-subscriber network, and engineered a responsive corporate platform with React and Node.js.',
    },
    {
        kind: 'internship',
        title: 'BIOMEDIQA: Internship',
        meta: 'BIOMEDIQA · Internship',
        period: '',
        text: 'Worked in a team using Git version control and its workflow strategies, and turned what I learned into a published article on Git workflow types.',
    },
    {
        kind: 'education',
        title: 'Engineering Degree: AI & Data Science',
        meta: 'ESIEA Paris · Double Degree EPI / ESIEA · 2025 – 2027 · Paris, France',
        period: '2025 – 2027',
        text: 'Double degree in Artificial Intelligence & Data Science at ESIEA Paris and EPI Tunisia, graduating in 2027.',
    },
    {
        kind: 'education',
        title: 'Railway Communication & IT',
        meta: 'Shijiazhuang Institute of Railway Technology (SIRT) · 2024 – 2027 · China',
        period: '2024 – 2027',
        text: '',
    },
    {
        kind: 'education',
        title: 'Integrated Preparatory & Engineering Cycle',
        meta: 'International Multidisciplinary School (EPI) · 2022 – 2025 · Tunisia',
        period: '2022 – 2025',
        text: '',
    },
];
