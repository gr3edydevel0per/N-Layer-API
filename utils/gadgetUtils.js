

class GadgetUtils {
    static generateGadgetName() {
        const prefixes = [
            "Nano", "Smart", "Ultra", "Quantum", "Cyber", "Neuro", "Volt", "Hyper",
            "Auto", "Mega", "Zyro", "Giga", "Opti", "Echo", "Drift", "Xeno"
        ];

        const cores = [
            "Pulse", "Gear", "Lens", "Snap", "Loop", "Track", "Node", "Core",
            "Link", "Wave", "Spark", "Scope", "Bot", "Cast", "Blade", "Dock"
        ];

        const suffixes = [
            "X", "Pro", "Max", "One", "360", "Go", "Plus", "Edge", "Mini", "Prime",
            "Flex", "Lite", "Jet", "Zoom", "Drive"
        ];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const core = cores[Math.floor(Math.random() * cores.length)];
        const suffix = Math.random() < 0.7
            ? suffixes[Math.floor(Math.random() * suffixes.length)]
            : "";

        const gadgetName = `${prefix}${core}${suffix}`;
        return gadgetName
    }

    static generateSuccessProbability() {
        return  Math.floor(Math.random() * 100);
    }

    // static generateSuccessProbabilities(count) {
    //     if (!Number.isInteger(count) || count <= 0) return [];
    //     return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
    // }

}
module.exports = GadgetUtils;