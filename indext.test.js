import { describe, test, expect } from '@jest/globals';
import { isValidJson, getValueByPath, updateJsonByPath, removeJsonByPath, mergeJsonObjects } from './index.js';

describe('JSON Update and Merge Tests', () => {
    const tempJson = {
        "bpRequest": {
            "custLoginId": "user123",
            "tranDate": "2025-07-02",
            "tranTime": "10:30:00",
            "validateDate": "2025-07-02",
            "tranType": "PAYMENT",
            "processingDate": "2025-07-02",
            "valueDate": "2025-07-02",
            "prodCode": "BP001",
            "bptrnChannel": "MOBILE",
            "mpsChannelField": "MPS001",
            "processingBranch": "001",
            "paymentAmount": 1000.00,
            "interBranchRegion": "BKK",
            "financialType": "DEBIT",
            "userTranCode": "UTR001",
            "accountFrom": {
                "accountNo": "1234567890",
                "amount": 1000.00,
                "accountType": "SAVINGS",
                "accountCurrency": "THB",
                "bankCode": "014",
                "branchCode": "001",
                "branchRegion": "BKK",
                "branchName": "Bangkok Main Branch"
            },
            "chequeInfo": {
                "chequeNo": "CHQ001",
                "chequeType": "BANK_CHEQUE",
                "postDate": "2025-07-02",
                "bankCode": "014"
            },
            "feeChargeType": "SHARED",
            "fee": [
                {
                    "feeAmount": 10.00,
                    "feeType": "TRANSFER_FEE",
                    "feeCurrency": "THB"
                }
            ],
            "bpCommission": 5.00,
            "bpFlag": "Y",
            "billerInfo": {
                "billerId": "BILL001",
                "accountNo": "BILL001",
                "amount": 1000.00,
                "accountType": "BILLING",
                "accountCurrency": "THB",
                "bankCode": "014",
                "branchCode": "001",
                "branchRegion": "BKK",
                "branchName": "Bangkok Main Branch",
                "billerCompCode": "COMP001",
                "billRef1": "REF001",
                "billRef2": "REF002",
                "billRef3": "REF003",
                "billerType": "UTILITY",
                "billerSubType": "ELECTRICITY",
                "isLoanBiller": false,
                "loanType": "PERSONAL",
                "isAllowQrFlag": true,
                "onlineBillerType": "ONLINE",
                "checkDigitLogic": "MOD11"
            },
            "accountTo2": {
                "accountNo": "0987654321",
                "amount": 500.00,
                "accountType": "CURRENT",
                "accountCurrency": "THB",
                "bankCode": "014",
                "branchCode": "002",
                "branchRegion": "CNX",
                "branchName": "Chiang Mai Branch"
            },
            "accountChange": {
                "accountNo": "1234567890",
                "amount": 1000.00,
                "accountType": "SAVINGS",
                "accountCurrency": "THB",
                "bankCode": "014",
                "branchCode": "001",
                "branchRegion": "BKK",
                "branchName": "Bangkok Main Branch"
            },
            "AMLOInfo": {
                "customerRefType": "CITIZEN_ID",
                "customerRefId": "1234567890123"
            },
            "statement": {
                "annotation": "Payment transaction",
                "accountFrom": "Account debited",
                "accountTo": "Account credited",
                "accountChange": "Balance updated",
                "feeInfo": "Fee applied"
            }
        },
        "billerProfile": {
            "id": "PROF001",
            "billerId": "BILL001",
            "accountNo": "1234567890",
            "taxId": "1234567890123",
            "otherTaxId": "ALT123456",
            "billerNameTh": "บริษัท ตัวอย่าง จำกัด",
            "billerNameEn": "Sample Biller Company",
            "companyNameTh": "บริษัท ตัวอย่าง จำกัด",
            "companyNameEn": "Sample Company Ltd",
            "companyCode": "COMP001",
            "categoryCode": "UTILITIES",
            "onlineBillerVerifyFlag": 1,
            "onlineBillerVerifyTransactionType": "VERIFY",
            "onlineBillerIndicationFlag": true,
            "onlineBillerConfirmFlag": "Y",
            "onlineBillerConfirmTransactionType": "CONFIRM",
            "promptpayFlag": "Y",
            "providerCode": "PROV001",
            "providerBank": "014",
            "ewalletFlag": "Y",
            "checkDigitLogic": "MOD11",
            "formatType": "FIXED",
            "mcnProfileId": "MCN001",
            "refOption": "MANUAL",
            "effDate": "2025-01-01",
            "expDate": "2025-12-31",
            "channel01": true,
            "channel02": true,
            "channel03": true,
            "channel04": true,
            "channel05": true,
            "channel06": true,
            "channel07": true,
            "channel08": true,
            "channel09": true,
            "channel10": true,
            "channel11": true,
            "channel12": true,
            "channel13": true,
            "channel14": true,
            "channel15": true,
            "channel16": true,
            "channel17": true,
            "channel18": true,
            "outsourceFee": 5.00,
            "sharingFee": 2.50,
            "iso20022Flag": true,
            "customerType": "INDIVIDUAL",
            "governmentShareFlag": false,
            "allowQrExpires": true,
            "merchantCategoryCode": "4900",
            "kymFlag": true,
            "businessTypeCode": "BT001",
            "businessTypeDesc": "Utility Services",
            "caplimitPerDay": 50000.00,
            "createdDate": "2025-01-01T10:00:00",
            "updatedDate": "2025-07-02T10:30:00",
            "postingOption": 1,
            "statementOption": 1,
            "batchOutputGenSchedule": "DAILY",
            "batchOutputGenReport": true,
            "batchOutputGenTextfile": true,
            "textfileForm128Flag": true,
            "textfileForm256Flag": true,
            "textfileForm334Flag": false,
            "textfileFormBcmServiceFlag": true,
            "textfile256Format": "FIXED_WIDTH",
            "feeChargeType": "SHARED",
            "allowCashFlag": true,
            "allowTransferFlag": true,
            "allowBankChequeFlag": true,
            "allowCustomerChequeFlag": true,
            "allowCreditCardFlag": true,
            "postingAccountNo2": "9876543210",
            "postingAccountType2": "GL",
            "postingAmount2": "100.00",
            "alertMessage1": "Transaction successful",
            "alertMessage2": "Please keep receipt",
            "b2kMerchantId": "MERCH001",
            "bcmStatementFlag": true,
            "specialFeeFlag": false,
            "specialFeeModule": "SPECIAL_FEE_001",
            "noticeChequeTranFlag": true,
            "textfilePayFlag": "Y",
            "channel01TierLevel": 1,
            "channel02TierLevel": 1,
            "channel03TierLevel": 1,
            "channel04TierLevel": 1,
            "channel05TierLevel": 1,
            "channel06TierLevel": 1,
            "channel07TierLevel": 1,
            "channel08TierLevel": 1,
            "channel09TierLevel": 1,
            "channel10TierLevel": 1,
            "channel11TierLevel": 1,
            "channel12TierLevel": 1,
            "channel13TierLevel": 1,
            "channel14TierLevel": 1,
            "channel15TierLevel": 1,
            "channel16TierLevel": 1,
            "channel17TierLevel": 1,
            "channel18TierLevel": 1
        },
        "virtualAccount": [
            {
                "vaOfAccount": "VA001",
                "searchVaInformation": {
                    "va": "VA001",
                    "updBalOpt": "AUTO",
                    "updBalODesc": "Automatic balance update",
                    "intStmtOpt": "DAILY",
                    "intStmtDesc": "Daily internal statement",
                    "histStmtOpt": "MONTHLY",
                    "histStmtDesc": "Monthly historical statement"
                }
            }
        ]
    }
    test('Update JSON object at a specified path', async () => {
        const updatedJson = await updateJsonByPath(tempJson, 'bpRequest.accountFrom.amount', 2000.00);
        expect(updatedJson.bpRequest.accountFrom.amount).toBe(2000.00);

    });

    test('merged json new node', async () => {
        const newJson = {
            "foo": "bar",
            "baz": {
                "qux": "quux"
            }
        };
        const mergedJson = mergeJsonObjects(tempJson, newJson);
        expect(mergedJson.foo).toBe("bar");
        expect(mergedJson.baz.qux).toBe("quux");
        console.log(mergedJson);
    });

    test('merge json existing node', async () => {
        const newJson = {
            "bpRequest": {
                "newField": "New Value"
            },
            "billerProfile": {
                "newField": "New Biller Value"
            }
        };
        const mergedJson = mergeJsonObjects(tempJson, newJson);
        expect(mergedJson.bpRequest.newField).toBe("New Value");
        expect(mergedJson.billerProfile.newField).toBe("New Biller Value");
        console.log(mergedJson);
    })

    test('merge json specified path', async () => {
        const newJson = {
            "newField": "New Value",
            "foo": [
                "bar",
                "baz"
            ]
        };
        const mergedJson = mergeJsonObjects(tempJson, newJson, 'bpRequest.accountFrom');
        expect(mergedJson.bpRequest.accountFrom.newField).toBe("New Value");
        expect(mergedJson.bpRequest.accountFrom.foo).toEqual(["bar", "baz"]);
    })

    test('merge array specified path', async () => {
        const newArray = [
            {
                "newField": "New Value",
                "foo": [
                    "bar",
                    "baz"
                ]
            },
            {
                "anotherField": "Another Value"
            }
        ]
        const mergedJson = mergeJsonObjects(tempJson, newArray, 'virtualAccount');
        console.log(mergedJson);
        expect(mergedJson.virtualAccount[1].newField).toEqual("New Value");
        expect(mergedJson.virtualAccount[1].foo).toEqual(["bar", "baz"]);
        expect(mergedJson.virtualAccount[2].anotherField).toEqual("Another Value");
    })

    test('merge json with non existing path', async () => {
        const newJson = {
            "bpRequest": {
                "nonExistngPath": {
                    "nonExistingField": {
                        "nonExistingSubField": "Non Existing Value"
                    }
                }
            }
        };
        const mergedJson = mergeJsonObjects(tempJson, newJson, 'bpRequest.nonExistngPath.nonExistingField');
        console.log(mergedJson);
        expect(mergedJson.bpRequest.nonExistngPath.nonExistingField.nonExistingSubField).toBe("Non Existing Value");
    })

    // Additional test cases for better coverage

    test('isValidJson - should throw error for null input', () => {
        expect(() => isValidJson(null)).toThrow('Invalid JSON: Input must be a non-null object.');
    });

    test('isValidJson - should throw error for non-object input', () => {
        expect(() => isValidJson("string")).toThrow('Invalid JSON: Input must be a non-null object.');
        expect(() => isValidJson(123)).toThrow('Invalid JSON: Input must be a non-null object.');
        expect(() => isValidJson(true)).toThrow('Invalid JSON: Input must be a non-null object.');
    });

    test('isValidJson - should throw error for array input', () => {
        expect(() => isValidJson([])).toThrow('Invalid JSON: Input must not be an array.');
        expect(() => isValidJson([1, 2, 3])).toThrow('Invalid JSON: Input must not be an array.');
    });

    test('isValidJson - should return true for valid object', () => {
        expect(isValidJson({})).toBe(true);
        expect(isValidJson({ key: "value" })).toBe(true);
    });

    test('getValueByPath - should return correct value for existing path', () => {
        const result = getValueByPath(tempJson, 'bpRequest.custLoginId');
        expect(result).toBe('user123');
    });

    test('getValueByPath - should return null for non-existing path', () => {
        const result = getValueByPath(tempJson, 'bpRequest.nonExistingField');
        expect(result).toBe(null);
    });

    test('getValueByPath - should throw error for invalid JSON', () => {
        expect(() => getValueByPath(null, 'path')).toThrow('Invalid JSON: Input must be a non-null object.');
    });

    test('getValueByPath - should handle JMESPath errors', () => {
        expect(() => getValueByPath(tempJson, 'invalid[path')).toThrow('Error searching JSON with path');
    });

    test('updateJsonByPath - should throw error for non-existing path', () => {
        expect(() => updateJsonByPath(tempJson, 'bpRequest.nonExistingField.deepField', 'newValue'))
            .toThrow('Path "bpRequest.nonExistingField.deepField" does not exist in the JSON object.');
    });

    test('updateJsonByPath - should throw error for invalid JSON', () => {
        expect(() => updateJsonByPath(null, 'path', 'value')).toThrow('Invalid JSON: Input must be a non-null object.');
    });

    test('updateJsonByPath - should handle JMESPath errors', () => {
        expect(() => updateJsonByPath(tempJson, 'invalid[path', 'value')).toThrow('Error updating JSON with path');
    });

    test('updateJsonByPath - should update array element by index', () => {
        const testJson = {
            "items": ["first", "second", "third"]
        };
        const updatedJson = updateJsonByPath(testJson, 'items[1]', 'updated');
        expect(updatedJson.items[1]).toBe('updated');
    });

    test('removeJsonByPath - should remove existing property', () => {
        const testJson = {
            "bpRequest": {
                "tempField": "temporary",
                "keepField": "permanent"
            }
        };
        const result = removeJsonByPath(testJson, 'bpRequest.tempField');
        expect(result.bpRequest.tempField).toBeUndefined();
        expect(result.bpRequest.keepField).toBe('permanent');
    });

    test('removeJsonByPath - should throw error for non-existing path', () => {
        expect(() => removeJsonByPath(tempJson, 'bpRequest.nonExistingField.deepField'))
            .toThrow('Path "bpRequest.nonExistingField.deepField" does not exist in the JSON object.');
    });

    test('removeJsonByPath - should throw error for invalid JSON', () => {
        expect(() => removeJsonByPath(null, 'path')).toThrow('Invalid JSON: Input must be a non-null object.');
    });

    test('removeJsonByPath - should handle JMESPath errors', () => {
        expect(() => removeJsonByPath(tempJson, 'invalid[path')).toThrow('Error removing JSON with path');
    });

    test('removeJsonByPath - should handle path navigation errors', () => {
        expect(() => removeJsonByPath(tempJson, 'nonExisting.deep.path'))
            .toThrow('Key path not found');
    });

    test('mergeJsonObjects - should handle undefined path parameter', () => {
        const newJson = { "newField": "newValue" };
        const result = mergeJsonObjects(tempJson, newJson, undefined);
        expect(result.newField).toBe("newValue");
    });

    test('mergeJsonObjects - should handle null path parameter', () => {
        const newJson = { "newField": "newValue" };
        const result = mergeJsonObjects(tempJson, newJson, null);
        expect(result.newField).toBe("newValue");
    });

    test('mergeJsonObjects - should throw error for invalid target JSON', () => {
        expect(() => mergeJsonObjects(null, {}, '')).toThrow('Invalid JSON: Input must be a non-null object.');
    });

    test('mergeJsonObjects - should throw error for invalid source JSON when path is empty', () => {
        expect(() => mergeJsonObjects(tempJson, null, '')).toThrow('Invalid JSON: Input must be a non-null object.');
    });

    test('mergeJsonObjects - should handle primitive value at path', () => {
        const testJson = {
            "simpleField": "simpleValue",
            "nested": {
                "field": "value"
            }
        };
        const newJson = { "replacedValue": "new" };
        const result = mergeJsonObjects(testJson, newJson, 'simpleField');
        expect(result.simpleField.replacedValue).toBe("new");
    });

    test('mergeJsonObjects - should handle completely non-existing path', () => {
        const newJson = { "newData": "value" };
        const result = mergeJsonObjects(tempJson, newJson, 'completely.nonexisting.deep.path');
        expect(result.completely.nonexisting.deep.path.newData).toBe("value");
    });

    test('mergeJsonObjects - should handle when source has null value for existing path', () => {
        const testJson = {
            "existing": {
                "path": { "data": "value" }
            }
        };
        const sourceJson = null;
        const result = mergeJsonObjects(testJson, sourceJson, 'existing.path');
        expect(result.existing.path).toBe(null);
    });

    test('mergeJsonObjects - should handle array merging with different structures', () => {
        const testJson = {
            "items": [1, 2, 3]
        };
        const newItems = ["a", "b"];
        const result = mergeJsonObjects(testJson, newItems, 'items');
        expect(result.items).toEqual(["a", "b"]);
    });

    test('mergeJsonObjects - should handle deep nested path creation', () => {
        const newJson = { "deepValue": "test" };
        const result = mergeJsonObjects(tempJson, newJson, 'level1.level2.level3.level4');
        expect(result.level1.level2.level3.level4.deepValue).toBe("test");
    });

    test('getValueByPath - should handle complex JMESPath expressions', () => {
        const result = getValueByPath(tempJson, 'bpRequest.fee[0].feeAmount');
        expect(result).toBe(10.00);
    });

    test('updateJsonByPath - should handle nested object updates', () => {
        const testJson = JSON.parse(JSON.stringify(tempJson)); // Deep clone
        const result = updateJsonByPath(testJson, 'bpRequest.accountFrom.bankCode', '999');
        expect(result.bpRequest.accountFrom.bankCode).toBe('999');
    });

    test('mergeJsonObjects - edge case with empty object merge', () => {
        const result = mergeJsonObjects(tempJson, {}, '');
        expect(result).toEqual(tempJson);
    });

    test('mergeJsonObjects - should handle boolean and number values in path', () => {
        const testJson = {
            "flags": {
                "active": true,
                "count": 42
            }
        };
        const newData = { "merged": true };
        const result = mergeJsonObjects(testJson, newData, 'flags.active');
        expect(result.flags.active.merged).toBe(true);
    });


});