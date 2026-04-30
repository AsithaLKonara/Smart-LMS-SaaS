
import AdmZip from "adm-zip";
import { parseStringPromise } from "xml2js";

export interface ScormManifest {
    title: string;
    version: string;
    entryPoint?: string;
}

export async function parseScormManifest(buffer: Buffer): Promise<ScormManifest> {
    try {
        const zip = new AdmZip(buffer);
        const manifestEntry = zip.getEntry("imsmanifest.xml");

        if (!manifestEntry) {
            throw new Error("imsmanifest.xml not found");
        }

        const xmlContent = manifestEntry.getData().toString("utf8");
        const result = await parseStringPromise(xmlContent);

        const title = result?.manifest?.metadata?.[0]?.['lom']?.[0]?.['general']?.[0]?.['title']?.[0]?.['string']?.[0]?._ 
                     || result?.manifest?.organizations?.[0]?.organization?.[0]?.title?.[0]
                     || "Untitled SCORM";

        const version = result?.manifest?.metadata?.[0]?.schemaversion?.[0] || "1.2";

        // Find entry point
        const resource = result?.manifest?.resources?.[0]?.resource?.[0];
        const entryPoint = resource?.$?.href;

        return {
            title,
            version,
            entryPoint
        };
    } catch (error) {
        console.error("[SCORM_PARSER]", error);
        throw new Error("Invalid SCORM package");
    }
}
