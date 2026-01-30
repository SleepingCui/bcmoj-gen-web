document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('checkpointsContainer');
    const addBtn = document.getElementById('addCheckpointBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const outputDiv = document.getElementById('output');
    const buttonGroup = document.getElementById('buttonGroup');
    const useNewFormatCheckbox = document.getElementById('useNewFormat');
    let checkpointCounter = 1;

    function addCheckpoint() {
        const row = document.createElement('div');
        row.className = 'checkpoint-row';
        row.innerHTML = `
          <input type="number" placeholder="测试点编号" min="1" step="1" class="checkpoint-number" value="${checkpointCounter}">
          <input type="text" placeholder="输入样例" class="input-file">
          <input type="text" placeholder="输出样例" class="output-file">
          <button type="button" class="remove-btn">删除</button>
        `;
        container.appendChild(row);
        checkpointCounter++;
    }

    addBtn.addEventListener('click', addCheckpoint);

    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            e.target.parentElement.remove();
        }
    });

    function generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    document.getElementById('configForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const useNewFormat = useNewFormatCheckbox.checked;

        // old format
        if (!useNewFormat) {
            const config = {
                timeLimit: parseInt(document.getElementById('timeLimit').value),
                memLimit: parseInt(document.getElementById('memLimit').value),
                securityCheck: document.getElementById('securityCheck').checked,
            };

            if (document.getElementById('enableO2').checked) {
                config.enableO2 = true;
            }

            const compareMode = parseInt(document.getElementById('compareMode').value);
            if (compareMode !== 1) {
                config.compareMode = compareMode;
            }

            config.checkpoints = {};
            const checkpointRows = container.querySelectorAll('.checkpoint-row');
            for (let i = 0; i < checkpointRows.length; i++) {
                const row = checkpointRows[i];
                const numInput = row.querySelector('.checkpoint-number');
                const inInput = row.querySelector('.input-file');
                const outInput = row.querySelector('.output-file');
                const num = numInput.value.trim();
                const inVal = inInput.value.trim();
                const outVal = outInput.value.trim();

                if (num && inVal) {
                    config.checkpoints[`${num}_in`] = inVal;
                }
                if (num && outVal) {
                    config.checkpoints[`${num}_out`] = outVal;
                }
            }
            const jsonString = JSON.stringify(config, null, 2);
            outputDiv.textContent = jsonString;
        }
        // new format
        else {
            const config = {
                time_limit: parseInt(document.getElementById('timeLimit').value),
                mem_limit: parseInt(document.getElementById('memLimit').value),
                enable_security_check: document.getElementById('securityCheck').checked,
            };

            if (document.getElementById('enableO2').checked) {
                config.enable_o2 = true;
            }

            const compareMode = parseInt(document.getElementById('compareMode').value);
            if (compareMode !== 1) {
                config.compare_mode = compareMode;
            }

            config.checkpoints = {};
            const checkpointRows = container.querySelectorAll('.checkpoint-row');
            for (let i = 0; i < checkpointRows.length; i++) {
                const row = checkpointRows[i];
                const numInput = row.querySelector('.checkpoint-number');
                const inInput = row.querySelector('.input-file');
                const outInput = row.querySelector('.output-file');
                const num = numInput.value.trim();
                if (num) {
                    const inVal = inInput.value.trim();
                    const outVal = outInput.value.trim();
                    config.checkpoints[num] = {
                        in: inVal || "",
                        out: outVal || ""
                    };
                }
            }
            const jsonString = JSON.stringify(config, null, 2);
            outputDiv.textContent = jsonString;
        }

        buttonGroup.style.display = 'block';
    });

    downloadBtn.addEventListener('click', function() {
        if (!outputDiv.textContent) return;
        const now = new Date();
        const dateStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
        const randomStr = generateRandomString(6);
        const filename = `problem_${dateStr}_${randomStr}.json`;
        const blob = new Blob([outputDiv.textContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    });

    copyBtn.addEventListener('click', function() {
        if (!outputDiv.textContent) return;
        navigator.clipboard.writeText(outputDiv.textContent).then(() => {
            alert('JSON 已复制到剪贴板');
        });
    });

    addCheckpoint(); 
});