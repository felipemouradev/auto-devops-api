
export class EnvParser {
    parse(filePathOrString) {
        let parseObject = filePathOrString
            .split("\n")
            .filter((item) => item.length >= 1 && !item.startsWith("#"))
            .map((item) => {
                let [key, value] = [...item.split("=")]
                return { [key]: value }
            })
        return parseObject;
    }
}