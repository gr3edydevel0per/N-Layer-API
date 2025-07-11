/**
 * GadgetUtils
 * Utility class for gadget-related helpers: name generation, confirmation codes, and probability calculations.
 */

class GadgetUtils {
  /**
   * Generates a random, unique gadget name.
   * @returns {string} Generated gadget name.
   */
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

    return `${prefix}${core}${suffix}`;
  }

  /**
   * Generates a random success probability (0-99).
   * @returns {number}
   */
  static generateSuccessProbability() {
    return Math.floor(Math.random() * 100);
  }

  /**
   * Generates a random 6-digit confirmation code.
   * @returns {string}
   */
  static generateConfirmationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

module.exports = GadgetUtils;