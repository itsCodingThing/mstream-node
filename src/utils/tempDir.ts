import {
    createWriteStream,
    mkdirSync,
    mkdtempSync,
    rmSync,
    readdirSync,
    readFileSync,
    statSync,
    WriteStream,
} from "fs";
import { join, sep } from "path";
import { tmpdir } from "os";

export const Sizes = {
    B: "Bytes",
    K: "KB",
    M: "MB",
    G: "GB",
    T: "TB",
};

function getAllFiles(dirPath: string, arrayOfFilesPath: string[] = []) {
    const arrayOfFilesName = readdirSync(dirPath);

    arrayOfFilesName.forEach((filename) => {
        const currentFilePath = `${dirPath}${sep}${filename}`;

        if (statSync(currentFilePath).isDirectory()) {
            arrayOfFilesPath = getAllFiles(currentFilePath, arrayOfFilesPath);
        } else {
            arrayOfFilesPath.push(currentFilePath);
        }
    });

    return arrayOfFilesPath;
}
function convertBytes(bytes: number, format: string) {
    const sizes = [Sizes.B, Sizes.K, Sizes.M, Sizes.G, Sizes.T];

    if (bytes === 0 || format === Sizes.B) {
        return bytes;
    } else {
        const power = sizes.indexOf(format);
        const value = Number((bytes / Math.pow(1024, power)).toFixed(2));
        return value;
    }
}

export function getTotalSizeOfDir(directoryPath: string, format = Sizes.B): number {
    const arrayOfFiles = getAllFiles(directoryPath);

    let totalSize = 0;

    arrayOfFiles.forEach((filePath) => {
        totalSize += statSync(filePath).size;
    });

    return convertBytes(totalSize, format);
}

class TempDir {
    #diranme;
    #tempDirPath;
    #maxSize = 100;

    constructor(dirname: string) {
        this.#diranme = dirname;
        this.#tempDirPath = this.#initializeTempDir();

        console.log(`temp directory is created at path ${this.#tempDirPath}`);
    }

    #initializeTempDir: () => string = () => {
        // Setting a temp directory in system temp directory
        const systemTempDir = tmpdir();
        const tempList = readdirSync(systemTempDir);

        tempList.forEach((name) => {
            if (name.includes(this.#diranme)) {
                rmSync(`${systemTempDir}${sep}${name}`, { recursive: true });
            }
        });

        const completePathOfTempDir = `${systemTempDir}${sep}${this.#diranme}--`;
        const mstreamTempDirPath = join(completePathOfTempDir);

        return mkdtempSync(mstreamTempDirPath);
    };

    saveFileInTempDir(name: string): WriteStream {
        const filePath = `${this.#tempDirPath}${sep}${name}`;

        if (this.isOverSized) {
            this.removeTempDir();
            this.#createTempDir();
            const saveFileStream = createWriteStream(this.#tempDirPath);
            return saveFileStream;
        } else {
            const saveFileStream = createWriteStream(filePath);
            return saveFileStream;
        }
    }

    readFileFromTempDir(name: string): Buffer {
        const filePath = `${this.#tempDirPath}${sep}${name}`;
        return readFileSync(filePath);
    }

    #createTempDir: () => void = () => {
        mkdirSync(this.#tempDirPath);
    };

    get isOverSized(): boolean {
        const dirSize = getTotalSizeOfDir(this.#tempDirPath, Sizes.M);

        if (dirSize < this.#maxSize) {
            return false;
        } else {
            return true;
        }
    }

    get getFileList(): string[] {
        return readdirSync(this.#tempDirPath);
    }

    get getTempDirPath(): string {
        return this.#tempDirPath;
    }

    removeTempDir(): void {
        rmSync(this.#tempDirPath, { recursive: true });
    }
}
export default TempDir;
