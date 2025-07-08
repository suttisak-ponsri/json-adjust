import jmespath from "jmespath";
import merge from 'deepmerge';

function splitPath(path) {
    return path.replace(/\[(\d+)\]/g, '.$1').split('.'); // Convert brackets to dot notation and split
}

function isValidJson(json) {
    if (typeof json !== 'object' || json === null) {
        throw new Error('Invalid JSON: Input must be a non-null object. ===> ' + JSON.stringify(json));
    } else if (Array.isArray(json)) {
        throw new Error('Invalid JSON: Input must not be an array.');
    }
    return true;
}

function navigateToPath(obj, keys) {
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
        if (current === undefined) {
            throw new Error(`Key path not found: ${keys.join('.')}`); // Path doesn't exist
        }
    }
    return current;
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
 * @param {string} path - The path to the property to update.
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
        const current = navigateToPath(json, pathParts);
        const lastKey = pathParts[pathParts.length - 1];
        current[lastKey] = value; // Update the value at the specified path
        return json; // Return the updated JSON object
    } catch (error) {
        throw new Error(`Error updating JSON with path "${path}": ${error.message}`);
    }
}

/**
 * Removes a property from a JSON object at a specified path.
 * @param {Object} json - The JSON object to modify.
 * @param {string} path - The path to the property to remove
 * @returns {Object} The updated JSON object with the property removed.
*/
function removeJsonByPath(json, path) {
    try {
        isValidJson(json);
        const pathParts = splitPath(path);
        const current = navigateToPath(json, pathParts);
        const lastKey = pathParts[pathParts.length - 1];
        if (current[lastKey] === undefined) {
            throw new Error(`Path "${path}" does not exist in the JSON object.`);
        }
        delete current[lastKey]; // Remove the value at the specified path
        return json; // Return the updated JSON object
    } catch (error) {
        throw new Error(`Error removing JSON with path "${path}": ${error.message}`);
    }
}

/** Merges two JSON objects recursively.
 * @param {Object} target - The target JSON object to merge into.
 * @param {Object} source - The source JSON object to merge from.
 * @param {string} path - The path where to merge the source object (empty string for root level merge)
 * @returns {Object} The merged JSON object.
 * @throws {Error} If either input is not a valid JSON object.
 */
function mergeJsonObjects(target, source, path = '') {
    isValidJson(target);
    
    // Root level merge
    if (!path || path === '') {
        isValidJson(source);
        return merge(target, source);
    }
    
    // Helper function to check if value is a plain object
    const isPlainObject = (obj) => obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    
    // Helper function to create nested object structure from path parts
    const createNestedObject = (pathParts, value) => 
        pathParts.reduceRight((acc, key) => ({ [key]: acc }), value);
    
    const pathParts = path.split('.');
    const searchedValue = jmespath.search(target, path);
    
    // Path exists and points to a plain object - merge with source
    if (isPlainObject(searchedValue)) {
        const mergedValue = merge(searchedValue, source);
        const nestedObject = createNestedObject(pathParts, mergedValue);
        return merge(target, nestedObject);
    }
    
    // Path exists but points to array or primitive - replace with source
    if (searchedValue !== undefined && searchedValue !== null) {
        const nestedObject = createNestedObject(pathParts, source);
        return merge(target, nestedObject);
    }
    
    // Path doesn't exist - find the nearest existing parent path
    let existingPath = '';
    for (let i = pathParts.length - 1; i > 0; i--) {
        const parentPath = pathParts.slice(0, i).join('.');
        if (jmespath.search(target, parentPath) !== null) {
            existingPath = parentPath;
            break;
        }
    }
    
    // If no existing parent found, merge at root level
    if (!existingPath) {
        const nestedObject = createNestedObject(pathParts, source);
        return merge(target, nestedObject);
    }
    
    // Recursively merge with the found parent path
    const sourceValue = jmespath.search(source, existingPath);
    if (sourceValue !== null) {
        return mergeJsonObjects(target, sourceValue, existingPath);
    }
    
    // Fallback: create new nested structure
    const nestedObject = createNestedObject(pathParts, source);
    return merge(target, nestedObject);
}

export { isValidJson, getValueByPath, updateJsonByPath, removeJsonByPath, mergeJsonObjects };