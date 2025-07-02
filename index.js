import jsonata from "jsonata";
import jmespath from "jmespath";

function splitPath(path) {
    return path.replace(/\[(\d+)\]/g, '.$1').split('.'); // Convert brackets to dot notation and split
}

function isValidJson(json) {
    if (typeof json !== 'object' || json === null) {
        throw new Error('Invalid JSON: Input must be a non-null object.');
    } else if (Array.isArray(json)) {
        throw new Error('Invalid JSON: Input must not be an array.');
    }
    return true;
}

/**
 * Searches a JSON object using a JMESPath expression.
 * @param {Object} json - The JSON object to search.
 * @param {string} path - The JMESPath expression to use for searching.
 * @returns {any} The result of the JMESPath search.
 * @throws {Error} If the search fails.
 */
function getValueByPath(json, path) {
    try {
        isValidJson(json);
        return jmespath.search(json, path);
    } catch (error) {
        throw new Error(`Error searching JSON with path "${path}": ${error.message}`);
    }
}

/** * Updates a JSON object at a specified path using JSONata.
 * @param {Object} json - The JSON object to update.
 * @param {string} path - The path to the property to update, in JMESPath format.
 * @param {any} value - The new value to set at the specified path.
 * @returns {Object} The updated JSON object.
 * @throws {Error} If the path does not exist or if the update fails.
 */
function updateJsonByPath(json, path, value) {
    try {
        isValidJson(json);
        const currentValue = jmespath.search(json, path);
        if (currentValue === undefined) {
            throw new Error(`Path "${path}" does not exist in the JSON object.`);
        }
        const pathParts = splitPath(path);
        const lastPart = pathParts.at(-1);
        const expressionString = `$~> | ${pathParts.slice(0, -1).join('.')}|{"${lastPart}": ${JSON.stringify(value)}}`;
        const jsonataExp = jsonata(expressionString);
        const result = jsonataExp.evaluate(json);
        return result;
    } catch (error) {
        throw new Error(`Error updating JSON with path "${path}": ${error.message}`);
    }
}

export { isValidJson, getValueByPath, updateJsonByPath };