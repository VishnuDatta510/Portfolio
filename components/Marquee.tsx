"use client";

export default function Marquee() {
    const items = [
        "Design",
        "Develop",
        "Deploy",
        "Iterate",
        "Innovate",
        "Create",
        "Design",
        "Develop",
        "Deploy",
        "Iterate",
        "Innovate",
        "Create",
    ];

    return (
        <div className="marquee">
            <div className="marquee-track">
                {items.map((item, i) => (
                    <span key={i} className="marquee-item hoverable">
                        <span className="marquee-dot" />
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
