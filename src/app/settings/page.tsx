import { SettingsPanels } from "@/components/SettingsPanels";
import pkg from "../../../package.json";

/**
 * Settings — an in-product account page. The version is read at build time; the
 * generation mode comes from context (seeded server-side in the root layout).
 * The interactive controls (theme, language, registry data) live in a client child.
 */
export default function SettingsPage() {
  return <SettingsPanels version={pkg.version} />;
}
