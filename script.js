/* =========================================================
   AI COMPLAINT ANALYZER
   COMPLETE JAVASCRIPT
   ========================================================= */


/* =========================================================
   WORD LISTS
   ========================================================= */

const customerWords = [
    "i",
    "we",
    "my"
];

const problemWords = [
    "problem",
    "issue",
    "damaged",
    "broken",
    "purchased",
    "purchase",
    "working",
    "wrong",
    "defective",
    "bad",
    "error",
    "faulty",
    "missing",
    "late"
];

const requestWords = [
    "refund",
    "replacement",
    "replace",
    "help",
    "assistance",
    "support",
    "resolve",
    "solution",
    "compensation",
    "return",
    "exchange"
];


/* =========================================================
   NORMALIZE INPUT
   ========================================================= */

function normalizeComplaint(text) {

    return text
        .toLowerCase()
        .replace(/[.,!?;:()]/g, "")
        .trim();

}


/* =========================================================
   TOKENIZATION
   ========================================================= */

function getTokens(text) {

    const normalized = normalizeComplaint(text);

    if (!normalized) {
        return [];
    }

    return normalized.split(/\s+/);

}


/* =========================================================
   COMPONENT DETECTION
   ========================================================= */

function detectComponents(tokens, complaint) {

    const customer = tokens.some(token =>
        customerWords.includes(token)
    );

    const problem =
        tokens.some(token =>
            problemWords.includes(token)
        ) ||
        complaint.toLowerCase().includes("not working");

    const request = tokens.some(token =>
        requestWords.includes(token)
    );

    return {
        customer,
        problem,
        request
    };

}


/* =========================================================
   SAMPLE COMPLAINTS
   ========================================================= */

function loadSample(number) {

    const input = document.getElementById("complaintInput");

    if (number === 1) {

        input.value =
            "I purchased a damaged product and I want a refund immediately.";

    }

    else if (number === 2) {

        input.value =
            "I purchased a damaged product.";

    }

    else if (number === 3) {

        input.value =
            "Damaged product and refund required.";

    }

    input.focus();

}


/* =========================================================
   MAIN ANALYSIS
   ========================================================= */

function analyzeComplaint() {

    const input =
        document.getElementById("complaintInput");

    const complaint = input.value.trim();

    if (!complaint) {

        alert("Please enter a customer complaint first.");

        input.focus();

        return;
    }


    /* ---------------- TOKENIZATION ---------------- */

    const tokens = getTokens(complaint);

    const components =
        detectComponents(tokens, complaint);


    displayTokens(tokens);


    /* ---------------- GRAMMAR ---------------- */

    analyzeGrammar(components);


    /* ---------------- DFA ---------------- */

    const dfaAccepted =
        analyzeDFA(components);


    /* ---------------- ERROR DETECTION ---------------- */

    detectGrammarErrors(components);


    /* ---------------- PDA ---------------- */

    const pdaAccepted =
        analyzePDA(components);


    /* ---------------- PARSE TREE ---------------- */

    const parseAccepted =
        createParseTree(
            components,
            tokens
        );


    /* ---------------- SLM ---------------- */

    performSLMAnalysis(
        complaint,
        tokens,
        components
    );


    /* ---------------- LLM ---------------- */

    performLLMAnalysis(
        complaint,
        tokens,
        components
    );


    /* ---------------- FINAL RESULT ---------------- */

    displayFinalResult(
        components,
        dfaAccepted,
        pdaAccepted,
        parseAccepted
    );


    /* ---------------- SCROLL TO RESULTS ---------------- */

    document.getElementById("results")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

}


/* =========================================================
   TOKEN DISPLAY
   ========================================================= */

function displayTokens(tokens) {

    const tokenCount =
        document.getElementById("tokenCount");

    const tokensBox =
        document.getElementById("tokens");

    tokenCount.textContent =
        `Total Tokens: ${tokens.length}`;

    tokensBox.innerHTML = "";

    tokens.forEach((token, index) => {

        const span =
            document.createElement("span");

        span.className = "token";

        span.textContent =
            `${index + 1}. ${token}`;

        tokensBox.appendChild(span);

    });

}


/* =========================================================
   FORMAL GRAMMAR
   ========================================================= */

function analyzeGrammar(components) {

    const grammarStatus =
        document.getElementById("grammarStatus");

    if (
        components.customer &&
        components.problem &&
        components.request
    ) {

        grammarStatus.className =
            "status-box status-success";

        grammarStatus.innerHTML =
            "✓ FORMAL GRAMMAR ACCEPTED — Complaint follows the defined grammar structure.";

    }

    else {

        grammarStatus.className =
            "status-box status-error";

        grammarStatus.innerHTML =
            "✗ FORMAL GRAMMAR NOT FULLY MATCHED — One or more grammar components are missing.";

    }

}


/* =========================================================
   DFA
   ========================================================= */

function analyzeDFA(components) {

    const dfaStatus =
        document.getElementById("dfaStatus");

    let state = "q0";


    if (components.customer) {

        state = "q1";

    }


    if (
        state === "q1" &&
        components.problem
    ) {

        state = "q2";

    }


    if (
        state === "q2" &&
        components.request
    ) {

        state = "q3";

    }


    if (
        state === "q3" &&
        components.customer &&
        components.problem &&
        components.request
    ) {

        state = "q4";

    }


    const accepted =
        state === "q4";


    if (accepted) {

        dfaStatus.className =
            "status-box status-success";

        dfaStatus.innerHTML =
            "✓ DFA ACCEPTED — Final State: q4";

    }

    else {

        dfaStatus.className =
            "status-box status-error";

        dfaStatus.innerHTML =
            `✗ DFA REJECTED — Current State: ${state}`;

    }


    return accepted;

}


/* =========================================================
   GRAMMAR ERROR DETECTION
   ========================================================= */

function detectGrammarErrors(components) {

    const customer =
        document.getElementById("customerComponent");

    const problem =
        document.getElementById("problemComponent");

    const request =
        document.getElementById("requestComponent");

    const errorArea =
        document.getElementById("grammarErrors");


    updateComponent(
        customer,
        components.customer
    );

    updateComponent(
        problem,
        components.problem
    );

    updateComponent(
        request,
        components.request
    );


    const missing = [];


    if (!components.customer) {
        missing.push("Customer");
    }

    if (!components.problem) {
        missing.push("Problem");
    }

    if (!components.request) {
        missing.push("Request");
    }


    if (missing.length === 0) {

        errorArea.innerHTML =
            "✓ No grammar errors detected. All required components are present.";

        errorArea.style.background =
            "#dcfce7";

        errorArea.style.color =
            "#166534";

    }

    else {

        errorArea.innerHTML =
            `✗ Grammar Error Detected<br>
             Missing Component(s): ${missing.join(", ")}`;

        errorArea.style.background =
            "#fee2e2";

        errorArea.style.color =
            "#991b1b";

    }

}


/* =========================================================
   COMPONENT UI
   ========================================================= */

function updateComponent(element, detected) {

    element.classList.remove(
        "detected",
        "missing"
    );


    const strong =
        element.querySelector("strong");


    if (detected) {

        element.classList.add("detected");

        strong.textContent =
            "✓ Detected";

    }

    else {

        element.classList.add("missing");

        strong.textContent =
            "✗ Missing";

    }

}


/* =========================================================
   PDA
   ========================================================= */

function analyzePDA(components) {

    const stackElement =
        document.getElementById("pdaStack");

    const logElement =
        document.getElementById("pdaLog");

    const statusElement =
        document.getElementById("pdaStatus");


    let stack = [];

    let state = "p0";

    let logs = [];


    logs.push(
        "PDA started at state p0."
    );


    /* CUSTOMER */

    if (components.customer) {

        stack.push("C");

        state = "p1";

        logs.push(
            "Customer detected → PUSH C → Move to p1"
        );

    }


    /* PROBLEM */

    if (
        state === "p1" &&
        components.problem
    ) {

        stack.push("P");

        state = "p2";

        logs.push(
            "Problem detected → PUSH P → Move to p2"
        );

    }


    /* REQUEST */

    if (
        state === "p2" &&
        components.request
    ) {

        stack.push("R");

        state = "p3";

        logs.push(
            "Request detected → PUSH R → Move to p3"
        );

    }


    let accepted = false;


    if (
        state === "p3" &&
        stack.length === 3
    ) {

        state = "p4";

        accepted = true;

        logs.push(
            "Input completed → Stack verified → Move to p4"
        );

    }

    else {

        logs.push(
            "Input incomplete → PDA cannot reach final state"
        );

    }


    /* STACK DISPLAY */

    if (stack.length === 0) {

        stackElement.innerHTML =
            "Empty";

    }

    else {

        stackElement.innerHTML = "";

        stack.forEach(symbol => {

            const item =
                document.createElement("span");

            item.className =
                "stack-item";

            item.textContent =
                symbol;

            stackElement.appendChild(item);

        });

    }


    /* LOG DISPLAY */

    logElement.innerHTML = "";

    logs.forEach(log => {

        const line =
            document.createElement("div");

        line.className =
            "log-line";

        line.textContent =
            log;

        logElement.appendChild(line);

    });


    /* STATUS */

    if (accepted) {

        statusElement.className =
            "status-box status-success";

        statusElement.innerHTML =
            "✓ PDA ACCEPTED — Final State: p4 — Stack: [C, P, R]";

    }

    else {

        statusElement.className =
            "status-box status-error";

        statusElement.innerHTML =
            `✗ PDA REJECTED — Final State: ${state}`;

    }


    return accepted;

}


/* =========================================================
   PARSE TREE
   ========================================================= */

function createParseTree(
    components,
    tokens
) {

    const parseTree =
        document.getElementById("parseTree");

    const customerWord =
        findCustomerWord(tokens);

    const problemWord =
        findProblemWord(tokens);

    const requestWord =
        findRequestWord(tokens);


    parseTree.innerHTML = `

        <div class="tree-root">
            Complaint
        </div>

        <div class="tree-branches">

            <div class="tree-node">

                <div class="tree-category">
                    Customer
                </div>

                <span class="tree-leaf">
                    ${customerWord || "Missing"}
                </span>

            </div>


            <div class="tree-node">

                <div class="tree-category">
                    Problem
                </div>

                <span class="tree-leaf">
                    ${problemWord || "Missing"}
                </span>

            </div>


            <div class="tree-node">

                <div class="tree-category">
                    Request
                </div>

                <span class="tree-leaf">
                    ${requestWord || "Missing"}
                </span>

            </div>

        </div>
    `;


    const accepted =
        components.customer &&
        components.problem &&
        components.request;


    const status =
        document.getElementById("parseStatus");


    if (accepted) {

        status.className =
            "status-box status-success";

        status.innerHTML =
            "✓ PARSE TREE ACCEPTED — Complete grammar structure generated.";

    }

    else {

        status.className =
            "status-box status-error";

        status.innerHTML =
            "✗ PARSE TREE INCOMPLETE — One or more grammar components are missing.";

    }


    return accepted;

}


/* =========================================================
   FIND WORDS FOR PARSE TREE
   ========================================================= */

function findCustomerWord(tokens) {

    return tokens.find(token =>
        customerWords.includes(token)
    ) || null;

}


function findProblemWord(tokens) {

    return tokens.find(token =>
        problemWords.includes(token)
    ) || null;

}


function findRequestWord(tokens) {

    return tokens.find(token =>
        requestWords.includes(token)
    ) || null;

}


/* =========================================================
   SLM-STYLE ANALYSIS
   ========================================================= */

function performSLMAnalysis(
    complaint,
    tokens,
    components
) {

    const lower =
        complaint.toLowerCase();


    /* CATEGORY */

    let category =
        "General Complaint";


    if (
        lower.includes("refund") ||
        lower.includes("money") ||
        lower.includes("payment") ||
        lower.includes("charged")
    ) {

        category =
            "Payment / Refund";

    }

    else if (
        lower.includes("damaged") ||
        lower.includes("broken") ||
        lower.includes("defective") ||
        lower.includes("product")
    ) {

        category =
            "Product Complaint";

    }

    else if (
        lower.includes("delivery") ||
        lower.includes("delivered") ||
        lower.includes("order") ||
        lower.includes("late")
    ) {

        category =
            "Delivery Complaint";

    }

    else if (
        lower.includes("account") ||
        lower.includes("login") ||
        lower.includes("password")
    ) {

        category =
            "Account / Login";

    }

    else if (
        lower.includes("service") ||
        lower.includes("support") ||
        lower.includes("customer care")
    ) {

        category =
            "Customer Service";

    }


    /* SENTIMENT */

    const negativeWords = [
        "bad",
        "angry",
        "worst",
        "terrible",
        "poor",
        "disappointed",
        "damaged",
        "broken",
        "problem",
        "issue",
        "wrong",
        "defective",
        "frustrated"
    ];


    const positiveWords = [
        "good",
        "great",
        "excellent",
        "happy",
        "satisfied",
        "thank"
    ];


    const negativeCount =
        tokens.filter(token =>
            negativeWords.includes(token)
        ).length;


    const positiveCount =
        tokens.filter(token =>
            positiveWords.includes(token)
        ).length;


    let sentiment =
        "Neutral";


    if (negativeCount > positiveCount) {

        sentiment =
            "Negative";

    }

    else if (positiveCount > negativeCount) {

        sentiment =
            "Positive";

    }


    /* URGENCY */

    const urgentWords = [
        "urgent",
        "immediately",
        "emergency",
        "asap",
        "quickly",
        "critical",
        "today"
    ];


    const isUrgent =
        urgentWords.some(word =>
            lower.includes(word)
        );


    const urgency =
        isUrgent ? "High" : "Normal";


    /* SUMMARY */

    let summary =
        `Customer has submitted a ${category.toLowerCase()}.`;


    if (components.problem) {

        summary +=
            " A problem with the product or service has been identified.";

    }


    if (components.request) {

        summary +=
            " The customer has also made a request for resolution.";

    }


    /* CORRECTION */

    let correction =
        "Please provide more details about your complaint and the resolution you require.";


    if (
        components.customer &&
        components.problem &&
        components.request
    ) {

        correction =
            "I purchased a damaged product and I would like a refund. Please resolve this issue as soon as possible.";

    }


    document.getElementById("slmCategory")
        .textContent = category;

    document.getElementById("slmSentiment")
        .textContent = sentiment;

    document.getElementById("slmUrgency")
        .textContent = urgency;

    document.getElementById("slmSummary")
        .textContent = summary;

    document.getElementById("slmCorrection")
        .textContent = correction;

}


/* =========================================================
   LLM ANALYSIS DEMO
   ========================================================= */

function performLLMAnalysis(
    complaint,
    tokens,
    components
) {

    const lower =
        complaint.toLowerCase();


    /* INTENT */

    let intent =
        "Request for assistance";


    if (
        lower.includes("refund") ||
        lower.includes("money")
    ) {

        intent =
            "Request for Refund";

    }

    else if (
        lower.includes("replacement") ||
        lower.includes("replace") ||
        lower.includes("exchange")
    ) {

        intent =
            "Request for Replacement";

    }

    else if (
        lower.includes("help") ||
        lower.includes("support")
    ) {

        intent =
            "Request for Customer Support";

    }


    /* TYPE */

    let type =
        "General Complaint";


    if (
        lower.includes("damaged") ||
        lower.includes("broken") ||
        lower.includes("defective")
    ) {

        type =
            "Product Quality Complaint";

    }

    else if (
        lower.includes("delivery") ||
        lower.includes("late")
    ) {

        type =
            "Delivery Complaint";

    }

    else if (
        lower.includes("payment") ||
        lower.includes("charged") ||
        lower.includes("refund")
    ) {

        type =
            "Payment Complaint";

    }


    /* PRIORITY */

    const highPriorityWords = [
        "urgent",
        "immediately",
        "emergency",
        "critical",
        "asap"
    ];


    const priority =
        highPriorityWords.some(word =>
            lower.includes(word)
        )
            ? "High"
            : "Medium";


    /* UNDERSTANDING */

    let understanding =
        "The system identified a customer complaint and analyzed its structure and possible intention.";


    if (
        components.problem &&
        components.request
    ) {

        understanding =
            "The customer has identified a specific problem and is requesting a resolution from the service provider.";

    }


    /* RESPONSE */

    const response =
        "We are sorry for the inconvenience. Your complaint has been received and our support team will review the issue and assist you with the requested resolution.";


    /* RESOLUTION */

    let resolution =
        "Contact customer support and provide the required details for further assistance.";


    if (intent === "Request for Refund") {

        resolution =
            "Verify the transaction and process the refund according to the company's refund policy.";

    }

    else if (intent === "Request for Replacement") {

        resolution =
            "Verify the product issue and arrange a replacement according to the replacement policy.";

    }


    document.getElementById("llmIntent")
        .textContent = intent;

    document.getElementById("llmType")
        .textContent = type;

    document.getElementById("llmPriority")
        .textContent = priority;

    document.getElementById("llmUnderstanding")
        .textContent = understanding;

    document.getElementById("llmResponse")
        .textContent = response;

    document.getElementById("llmResolution")
        .textContent = resolution;

}


/* =========================================================
   FINAL RESULT
   ========================================================= */

function displayFinalResult(
    components,
    dfaAccepted,
    pdaAccepted,
    parseAccepted
) {

    const grammarAccepted =
        components.customer &&
        components.problem &&
        components.request;


    const finalMessage =
        document.getElementById("finalMessage");


    const finalGrammar =
        document.getElementById("finalGrammar");

    const finalDFA =
        document.getElementById("finalDFA");

    const finalPDA =
        document.getElementById("finalPDA");

    const finalParse =
        document.getElementById("finalParse");


    finalGrammar.textContent =
        grammarAccepted
            ? "ACCEPTED"
            : "REJECTED";


    finalDFA.textContent =
        dfaAccepted
            ? "ACCEPTED"
            : "REJECTED";


    finalPDA.textContent =
        pdaAccepted
            ? "ACCEPTED"
            : "REJECTED";


    finalParse.textContent =
        parseAccepted
            ? "VALID"
            : "INCOMPLETE";


    if (
        grammarAccepted &&
        dfaAccepted &&
        pdaAccepted &&
        parseAccepted
    ) {

        finalMessage.textContent =
            "✓ Complaint successfully passed the complete FLA analysis pipeline.";

    }

    else {

        finalMessage.textContent =
            "✗ Complaint requires correction because one or more FLA validation stages were not accepted.";

    }

}


/* =========================================================
   CLEAR ANALYSIS
   ========================================================= */

function clearAnalysis() {

    document.getElementById("complaintInput")
        .value = "";


    document.getElementById("tokenCount")
        .textContent = "No analysis yet";


    document.getElementById("tokens")
        .innerHTML = "";


    document.getElementById("grammarStatus")
        .className = "status-box";

    document.getElementById("grammarStatus")
        .textContent = "Waiting for analysis...";


    document.getElementById("dfaStatus")
        .className = "status-box";

    document.getElementById("dfaStatus")
        .textContent = "Waiting for analysis...";


    resetComponent(
        "customerComponent"
    );

    resetComponent(
        "problemComponent"
    );

    resetComponent(
        "requestComponent"
    );


    document.getElementById("grammarErrors")
        .textContent = "Waiting for analysis...";

    document.getElementById("grammarErrors")
        .style.background = "#f8fafc";

    document.getElementById("grammarErrors")
        .style.color = "#475569";


    document.getElementById("pdaStack")
        .textContent = "Empty";


    document.getElementById("pdaLog")
        .textContent = "Waiting for analysis...";


    document.getElementById("pdaStatus")
        .className = "status-box";

    document.getElementById("pdaStatus")
        .textContent = "Waiting for analysis...";


    document.getElementById("parseTree")
        .innerHTML = `
            <div class="tree-root">
                Complaint
            </div>

            <div class="tree-message">
                Analyze a complaint to generate the parse tree.
            </div>
        `;


    document.getElementById("parseStatus")
        .className = "status-box";

    document.getElementById("parseStatus")
        .textContent = "Waiting for analysis...";


    document.getElementById("slmCategory")
        .textContent = "—";

    document.getElementById("slmSentiment")
        .textContent = "—";

    document.getElementById("slmUrgency")
        .textContent = "—";

    document.getElementById("slmSummary")
        .textContent = "—";

    document.getElementById("slmCorrection")
        .textContent = "—";


    document.getElementById("llmIntent")
        .textContent = "—";

    document.getElementById("llmType")
        .textContent = "—";

    document.getElementById("llmPriority")
        .textContent = "—";

    document.getElementById("llmUnderstanding")
        .textContent = "—";

    document.getElementById("llmResponse")
        .textContent = "—";

    document.getElementById("llmResolution")
        .textContent = "—";


    document.getElementById("finalMessage")
        .textContent =
        "Enter a complaint and click Analyze Complaint.";


    document.getElementById("finalGrammar")
        .textContent = "—";

    document.getElementById("finalDFA")
        .textContent = "—";

    document.getElementById("finalPDA")
        .textContent = "—";

    document.getElementById("finalParse")
        .textContent = "—";

}


/* =========================================================
   RESET COMPONENT
   ========================================================= */

function resetComponent(id) {

    const element =
        document.getElementById(id);

    element.classList.remove(
        "detected",
        "missing"
    );

    const strong =
        element.querySelector("strong");

    strong.textContent = "—";

}


/* =========================================================
   PRINT ANALYSIS
   ========================================================= */

function printAnalysis() {

    window.print();

}


/* =========================================================
   PAGE READY
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const input =
            document.getElementById(
                "complaintInput"
            );


        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.ctrlKey &&
                    event.key === "Enter"
                ) {

                    analyzeComplaint();

                }

            }
        );

    }
);