import { getSQLiteInstance } from "../sqlite/instance";
import { IOTABundlesProvider } from "../interfaces/IOTABundlesProvider";
import { SQLiteOTABundlesProvider } from "../sqlite/SQLiteOTABundlesProvider";

export type ProviderType = "sqlite";

export class OTABundlesProviderFactory {
  static createProvider(type: ProviderType = "sqlite"): IOTABundlesProvider {
    switch (type) {
      case "sqlite":
        return new SQLiteOTABundlesProvider(getSQLiteInstance());
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }
}
