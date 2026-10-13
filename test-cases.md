|TC ID| meternumber  | amount | starting balance | expected message | expected balance afterwards |
|-----|--------------|--------|------------------|------------------|-----------------------------|
| TC01 | 1234567890 | "50.00" | "500.00" | Purchase successful | R450.00 | Checks if a normal electricity purchase works correctly. |

| TC02 | 1234567890 | "20.00" | "500.00" | Purchase successful | R480.00 | Checks the minimum allowed purchase amount. |

| TC03 | 1234567890 | "19.99" | "500.00" | Amount must be at least R20.00 | R500.00 | Checks an amount just below the minimum limit. |

| TC04 | 1234567890 | "20.01" | "500.00" | Purchase successful | R479.99 | Checks an amount just above the minimum limit. |

| TC05 | 1234567890 | "2000.00" | "2500.00" | Purchase successful | R500.00 | Checks the maximum allowed purchase amount. |

| TC06 | 1234567890 | "2000.01" | "2500.00" | Amount cannot exceed R2000.00 | R2500.00 | Checks an amount just above the maximum limit. |

| TC07 | 1234567890 | "200.00" | "100.00" | Insufficient balance | R100.00 | Checks if the system rejects a purchase that costs more than the available balance. |

| TC08 | "" | "50.00" | "500.00" | Invalid meter number | R500.00 | Checks what happens when the customer leaves the meter number empty. |

| TC09 | " 1234567890 " | "50.00" | "500.00" | Invalid meter number or purchase successful if spaces are accepted | R500.00 if rejected; R450.00 if successful | Checks whether extra spaces in the meter number cause a problem. |

| TC10 | 1234567890 | "00050.00" | "500.00" | Purchase successful or invalid amount, depending on the rules | R450.00 if successful; R500.00 if rejected | Checks whether the system accepts an amount with leading zeros. |