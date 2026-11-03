// config/default_config.js
module.exports = {
    // Cấu hình chung
    general: {
        preset: "Maximum", // "Minified", "Standard", "Maximum", "Custom"
        verbose: true,     // In thông tin chi tiết quá trình xử lý ra console
        debugInfo: false   // Giữ lại thông tin dòng cho mục đích debug
    },

    // Cấu hình VM Architecture
    vm: {
        randomizeOpcodes: true,   // Xáo trộn thứ tự Opcode Handler cho mỗi lần build
        bytecodeEncryption: true, // Mã hóa chuỗi Bytecode đầu ra (LPH_DEC / LPH_ENC)
        vmLoopType: "WhileSwitch",// "WhileSwitch" hoặc "IndirectGoto"
        inlineHandlers: false     // Ghép trực tiếp một số handler đơn giản để tăng tốc độ
    },

    // Cấu hình các lớp biến đổi code (Obfuscation Passes)
    macros: {
        controlFlowFlattening: {
            enabled: true,
            intensity: 2 // Độ sâu/mức độ làm phẳng luồng (1: Cơ bản, 2: Chèn State ảo)
        },
        opaquePredicates: {
            enabled: true,
            frequency: 0.3 // Tỷ lệ chèn điều kiện ảo vào các khối lệnh (0.0 -> 1.0)
        },
        constantEncryption: {
            strings: true,   // Mã hóa chuỗi hằng số (String encryption)
            numbers: true,   // Mã hóa hằng số số (Number obfuscation / Bitwise math)
            tables: true     // Làm rối cấu trúc Bảng (Table key obfuscation)
        },
        deadCodeInsertion: {
            enabled: true,
            junkRatio: 0.2 // Tỷ lệ chèn code rác so với code gốc
        }
    },

    // Cấu hình Anti & Protection (Lớp bảo vệ Runtime)
    protection: {
        antiTamper: {
            enabled: true,
            integrityCheck: true // Kiểm tra hash/checksum của Bytecode & VM
        },
        antiDump: {
            enabled: true,
            stripDebug: true,   // Xóa mọi thông tin debug của Lua runtime
            hideUpvalues: true   // Ẩn bảng Upvalue khỏi môi trường
        },
        antiHook: {
            enabled: true,
            protectedGlobals: [  // Danh sách các hàm toàn cục cần kiểm tra tính toàn vẹn (Hook detection)
                "table.pack", "table.unpack", "string.sub", "string.byte",
                "bit32.band", "bit32.bxor", "pcall", "setmetatable"
            ]
        },
        antiEnvLogger: {
            enabled: true // Chống các công cụ Spy/Logger/Print Dumper
        }
    }
};
