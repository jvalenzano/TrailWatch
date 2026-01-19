import { useUIMode } from '../hooks/useUIMode';
import { UI_MODES, type UIModeName } from '../config/ui-modes';

/**
 * Dashboard page showing current UI mode and enabled features.
 * This is a test page for Phase 0 verification.
 */
export function Dashboard() {
    const { mode, modeName, setMode } = useUIMode();

    const enabledFeatures = Object.entries(mode.features)
        .filter(([, enabled]) => enabled)
        .map(([name]) => name);

    const disabledFeatures = Object.entries(mode.features)
        .filter(([, enabled]) => !enabled)
        .map(([name]) => name);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-emerald-400 mb-2">
                        TrailWatch Ranger Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Phase 0 Verification — UI Mode Configuration
                    </p>
                </header>

                {/* Mode Selector */}
                <section className="mb-8 p-6 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Current Mode</h2>
                    <div className="flex gap-4 mb-4">
                        {(Object.keys(UI_MODES) as UIModeName[]).map((name) => (
                            <button
                                key={name}
                                onClick={() => setMode(name)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${modeName === name
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {UI_MODES[name].label}
                            </button>
                        ))}
                    </div>
                    <p className="text-gray-400">
                        <span className="font-medium text-white">{mode.label}:</span>{' '}
                        {mode.description}
                    </p>
                </section>

                {/* Feature Flags */}
                <section className="mb-8 p-6 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Feature Flags</h2>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-emerald-400 font-medium mb-2">
                                ✓ Enabled ({enabledFeatures.length})
                            </h3>
                            <ul className="space-y-1">
                                {enabledFeatures.length > 0 ? (
                                    enabledFeatures.map((name) => (
                                        <li key={name} className="text-gray-300 font-mono text-sm">
                                            {name}
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 italic">None</li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-gray-500 font-medium mb-2">
                                ✗ Disabled ({disabledFeatures.length})
                            </h3>
                            <ul className="space-y-1">
                                {disabledFeatures.map((name) => (
                                    <li key={name} className="text-gray-500 font-mono text-sm">
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Stack Info */}
                <section className="p-6 bg-gray-800 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
                    <ul className="space-y-2 text-gray-300">
                        <li>
                            <span className="text-gray-500">Framework:</span> React 18 + TypeScript
                        </li>
                        <li>
                            <span className="text-gray-500">Build:</span> Vite 7
                        </li>
                        <li>
                            <span className="text-gray-500">Styling:</span> Tailwind CSS 4
                        </li>
                        <li>
                            <span className="text-gray-500">Maps:</span> MapLibre GL JS (pending)
                        </li>
                        <li>
                            <span className="text-gray-500">Data:</span> TanStack Query (pending)
                        </li>
                    </ul>
                </section>

                <footer className="mt-8 text-center text-gray-500 text-sm">
                    TrailWatch Phase 0 • Ranger Dashboard Track • January 2026
                </footer>
            </div>
        </div>
    );
}
