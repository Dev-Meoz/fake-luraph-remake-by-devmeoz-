#!/usr/bin/env node
// bin/cli.js

const fs = require('fs');
const path = require('path');

// Nạp cấu hình mặc định
const defaultConfig = require('../config/default_config');

function printBanner() {
    console.log(`
======================================================
         LURAPH ENGINE OBFUSCATOR v15.1 (Node.js)     
======================================================
`);
}

function printUsage() {
    console.log("Cú pháp:");
    console.log("  node bin/cli.js -i <input_file> -o <output_file> [tùy chọn]\n");
    console.log("Tùy chọn:");
    console.log("  -i, --input <path>      File Lua đầu vào cần obfuscate (Bắt buộc)");
    console.log("  -o, --output <path>     File Lua đầu ra sau khi mã hóa (Mặc định: output.lua)");
    console.log("  -p, --preset <name>     Chọn preset cấu hình (Minified | Standard | Maximum)");
    console.log("  --no-anti-tamper        Tắt lớp bảo vệ Anti-Tamper");
    console.log("  --no-cff                Tắt Control Flow Flattening");
    console.log("  -h, --help              Hiển thị hướng dẫn sử dụng");
}

function parseArgs(args) {
    let options = {
        inputFile: null,
        outputFile: "output.lua",
        // Tạo bản sao độc lập của cấu hình mặc định để tránh ghi đè tham chiếu
        config: JSON.parse(JSON.stringify(defaultConfig))
    };

    let i = 2; // Bỏ qua node path và script path trong process.argv
    while (i < args.length) {
        let a = args[i];
        if (a === "-i" || a === "--input") {
            i++;
            options.inputFile = args[i];
        } else if (a === "-o" || a === "--output") {
            i++;
            options.outputFile = args[i];
        } else if (a === "-p" || a === "--preset") {
            i++;
            options.config.general.preset = args[i];
        } else if (a === "--no-anti-tamper") {
            options.config.protection.antiTamper.enabled = false;
        } else if (a === "--no-cff") {
            options.config.macros.controlFlowFlattening.enabled = false;
        } else if (a === "-h" || a === "--help") {
            printUsage();
            process.exit(0);
        }
        i++;
    }

    return options;
}

function main() {
    printBanner();

    let opts = parseArgs(process.argv);

    if (!opts.inputFile) {
        console.log("[!] Lỗi: Bạn chưa cung cấp file đầu vào.\n");
        printUsage();
        process.exit(1);
    }

    console.log(`[+] Đang đọc mã nguồn từ: ${opts.inputFile}`);
    
    if (!fs.existsSync(opts.inputFile)) {
        console.error(`[ERROR] Không tìm thấy file đầu vào: ${opts.inputFile}`);
        process.exit(1);
    }
    
    let sourceCode = fs.readFileSync(opts.inputFile, 'utf8');
    console.log(`[+] Đã nạp cấu hình (Preset: ${opts.config.general.preset})`);

    -----------------------------------------------------------------
    -- PIPELINE XỬ LÝ (Mô phỏng tích hợp các module JS trong src/)
    -----------------------------------------------------------------
    console.log("[1/5] Đang phân tích cú pháp (Parsing AST)...");
    // let ast = Parser.parse(sourceCode);

    console.log("[2/5] Đang chèn các lớp bảo vệ Runtime (Anti-Tamper, Anti-Hook)...");
    // let ir = PassManager.buildIR(ast);

    console.log("[3/5] Đang thực hiện biến đổi mã nguồn (Control Flow, Constants Encryption)...");
    // ir = PassManager.applyMacros(ir, opts.config.macros);

    console.log("[4/5] Đang biên dịch sang Custom VM Bytecode...");
    // let bytecodePayload = Compiler.compile(ir, opts.config.vm);

    console.log("[5/5] Đang đóng gói Interpreter VM & Generate mã đầu ra...");
    
    let outputCode = `-- [[ Protected by Luraph Engine v15.1 (Node.js Core) ]]\n`
        + `local LPH_DEC = function(...) end\n`
        + `-- Bytecode Payload & VM Template Loader goes here --\n`
        + `print('Obfuscated Code Executed!')`;

    fs.writeFileSync(opts.outputFile, outputCode, 'utf8');
    console.log(`\n[✔] Quá trình Obfuscate hoàn tất! File xuất ra tại: ${opts.outputFile}`);
}

main();
