"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateStudentAnswers = evaluateStudentAnswers;
var genai_1 = require("@google/genai");
var genAI = new genai_1.GoogleGenAI({});
// Define the structured schema for the output based on the provided sample
var evaluationSchema = {
    type: genai_1.Type.OBJECT,
    properties: {
        ai_data: {
            type: genai_1.Type.ARRAY,
            items: {
                type: genai_1.Type.OBJECT,
                properties: {
                    image_index: { type: genai_1.Type.INTEGER },
                    section: { type: genai_1.Type.STRING },
                    question_id: { type: genai_1.Type.STRING },
                    question: { type: genai_1.Type.STRING },
                    marks: { type: genai_1.Type.INTEGER },
                    marks_awarded: { type: genai_1.Type.INTEGER },
                    feedback: { type: genai_1.Type.STRING },
                    difficulty: { type: genai_1.Type.STRING },
                    blooms_level: { type: genai_1.Type.STRING },
                    topic: { type: genai_1.Type.STRING },
                    co: { type: genai_1.Type.STRING },
                    po: { type: genai_1.Type.STRING },
                    pso: { type: genai_1.Type.STRING },
                    ai_confidence: { type: genai_1.Type.INTEGER },
                    teacher_intervention_required: { type: genai_1.Type.BOOLEAN },
                    marking_scheme: {
                        type: genai_1.Type.ARRAY,
                        items: {
                            type: genai_1.Type.OBJECT,
                            properties: {
                                point: { type: genai_1.Type.STRING },
                                mark: { type: genai_1.Type.INTEGER },
                                status: { type: genai_1.Type.BOOLEAN },
                            },
                            required: ['point', 'mark', 'status'],
                        },
                    },
                },
                required: [
                    'image_index',
                    'section',
                    'question_id',
                    'question',
                    'marks',
                    'marks_awarded',
                    'feedback',
                    'difficulty',
                    'blooms_level',
                    'topic',
                    'co',
                    'po',
                    'pso',
                    'ai_confidence',
                    'teacher_intervention_required',
                    'marking_scheme',
                ],
            },
        },
        totalMarkAwarded: { type: genai_1.Type.INTEGER },
        totalMarks: { type: genai_1.Type.INTEGER },
    },
    required: ['ai_data', 'totalMarkAwarded', 'totalMarks'],
    propertyOrdering: ['ai_data', 'totalMarkAwarded', 'totalMarks'],
};
// Function to upload a file and return its URI and MIME type
function uploadFile(filePath, mimeType) {
    return __awaiter(this, void 0, void 0, function () {
        var myfile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, genAI.files.upload({
                        file: filePath,
                        config: { mimeType: mimeType },
                    })];
                case 1:
                    myfile = _a.sent();
                    return [2 /*return*/, myfile];
            }
        });
    });
}
function deleteFile(fileUri) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, genAI.files.delete({ name: fileUri.name })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Main function to process files and generate evaluation
function evaluateStudentAnswers(questionPaperPath_1) {
    return __awaiter(this, arguments, void 0, function (questionPaperPath, keyScriptPaths, // Optional key scripts
    studentAnswerPath, totalMarks // Provided total marks
    ) {
        var questionPaper, keyScripts, studentAnswer, contents, response, evaluation;
        if (keyScriptPaths === void 0) { keyScriptPaths = []; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Upload question paper
                    console.log('Uploading question paper:', questionPaperPath);
                    return [4 /*yield*/, uploadFile(questionPaperPath, 'application/pdf')];
                case 1:
                    questionPaper = _a.sent();
                    return [4 /*yield*/, Promise.all(keyScriptPaths.map(function (path) { return uploadFile(path, 'application/pdf'); }))];
                case 2:
                    keyScripts = _a.sent();
                    return [4 /*yield*/, uploadFile(studentAnswerPath, 'application/pdf')];
                case 3:
                    studentAnswer = _a.sent();
                    contents = {
                        role: 'user',
                        parts: __spreadArray(__spreadArray([
                            {
                                fileData: {
                                    fileUri: questionPaper.uri,
                                    mimeType: questionPaper.mimeType,
                                },
                            }
                        ], keyScripts.map(function (ks) { return ({
                            fileData: {
                                fileUri: ks.uri,
                                mimeType: ks.mimeType,
                            },
                        }); }), true), [
                            {
                                fileData: {
                                    fileUri: studentAnswer.uri,
                                    mimeType: studentAnswer.mimeType,
                                },
                            },
                            {
                                text: "Evaluate the student's answer script based on the question paper and any provided key scripts. \nExtract questions from the question paper, match them to sections in the student's answers (using image_index for page references in the PDF).\nAward marks based on correctness, provide feedback, and fill in all fields as per the schema.\nThe total marks for the exam is ".concat(totalMarks, ".\nKeep Note, if even not answered, keep the question and in place feedback tell not attempted or stike off so keep marks as zero\nkeep All question in question paper\nKeep AI Conficence between 0 to 100 #how sure you are about the evaluation\nIf unsure about an answer, set teacher_intervention_required to true.\nCalculate totalMarkAwarded as the sum of marks_awarded.\nUse the provided schema for strict structured JSON output."),
                            },
                        ], false),
                    };
                    return [4 /*yield*/, genAI.models.generateContent({
                            model: 'gemini-2.0-flash',
                            contents: [contents],
                            config: {
                                responseMimeType: 'application/json',
                                responseSchema: evaluationSchema,
                            },
                        })];
                case 4:
                    response = _a.sent();
                    evaluation = JSON.parse(response.text);
                    return [2 /*return*/, evaluation];
            }
        });
    });
}
// Example usage
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var questionPaper, keyScripts, studentAnswer, totalMarks, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    questionPaper = '';
                    keyScripts = [];
                    studentAnswer = '';
                    totalMarks = 100;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, evaluateStudentAnswers(questionPaper, keyScripts, studentAnswer, totalMarks)];
                case 2:
                    result = _a.sent();
                    console.log(JSON.stringify(result, null, 2));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
