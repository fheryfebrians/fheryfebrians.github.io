import React from "react";

export default function TerminalView({
    lines,
    booted,
    input,
    prompt,
    clock,
    shake,
    inputRef,
    bottomRef,
    focusInput,
    handleInputChange,
    handleKeyDown,
    profile,
}) {
    return (
        <main
            className={`term-root ${shake ? "shake" : ""}`}
            onClick={focusInput}
        >
            <header className="term-bar">
                <div className="left">
                    <span className="status-dot" />
                    <span>
                        {profile.handle}@{profile.host}
                    </span>
                </div>

                <span className="clock">
                    {clock}
                </span>
            </header>

            <section className="term-body">
                {lines.map((line) => (
                    <div
                        key={line.id}
                        className={`term-line ${line.variant || ""}`}
                    >
                        {line.href ? (
                            <a
                                href={line.href}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {line.text}
                            </a>
                        ) : (
                            line.text
                        )}
                    </div>
                ))}

                {booted && (
                    <div className="term-inputrow">
                        <span className="prompt-label">
                            {prompt}
                        </span>

                        <input
                            ref={inputRef}
                            className="term-hidden-input"
                            value={input}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck={false}
                        />

                        <span className="typed">
                            {input}
                        </span>

                        <span
                            className="term-cursor"
                            aria-hidden="true"
                        />
                    </div>
                )}

                <div ref={bottomRef} />
            </section>
        </main>
    );
}