import { getDBInstance } from "../../instance";
import { IOTABundlesProvider } from "../interfaces/IOTABundlesProvider";
import { SQLiteOTABundlesProvider } from "../sqlite/SQLiteOTABundlesProvider";

export type ProviderType = "sqlite";

export class OTABundlesProviderFactory {
  static createProvider(type: ProviderType = "sqlite"): IOTABundlesProvider {
    switch (type) {
      case "sqlite":
        return new SQLiteOTABundlesProvider(getDBInstance());
      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }
}
