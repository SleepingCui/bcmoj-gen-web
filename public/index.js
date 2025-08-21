        let testCaseCount = 0;
        function addTestCase() {
            testCaseCount++;
            const testCaseHTML = `
                <div class="test-case" id="testCase-${testCaseCount}">
                    <div class="test-case-header">
                        <div class="test-case-title">
                            <i class="fas fa-vial"></i> 测试点 #${testCaseCount}
                        </div>
                        <button type="button" class="btn btn-sm btn-danger remove-test-case" data-id="${testCaseCount}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <label for="input-${testCaseCount}" class="form-label required-label">输入</label>
                            <textarea class="form-control test-input" id="input-${testCaseCount}" rows="3" placeholder="输入测试数据..." required></textarea>
                        </div>
                        <div class="col-md-6 mb-2">
                            <label for="output-${testCaseCount}" class="form-label required-label">输出</label>
                            <textarea class="form-control test-output" id="output-${testCaseCount}" rows="3" placeholder="预期输出..." required></textarea>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('testCases').insertAdjacentHTML('beforeend', testCaseHTML);
            document.querySelectorAll('.remove-test-case').forEach(button => {
                button.onclick = function() {
                    const id = this.getAttribute('data-id');
                    document.getElementById(`testCase-${id}`).remove();
                    updateJsonPreview();
                };
            });
            document.querySelectorAll('.test-input, .test-output').forEach(element => {
                element.addEventListener('input', updateJsonPreview);
            });
            
            updateJsonPreview();
        }
        function updateJsonPreview() {
            const timeLimit = document.getElementById('timeLimit').value;
            const securityCheck = document.getElementById('securityCheck').checked;
            const enableO2 = document.getElementById('enableO2').checked;
            const compareMode = document.getElementById('compareMode').value;
            const checkpoints = {};
            document.querySelectorAll('.test-case').forEach(testCase => {
                const id = testCase.id.split('-')[1];
                const input = document.getElementById(`input-${id}`).value;
                const output = document.getElementById(`output-${id}`).value;
                
                if (input.trim() && output.trim()) {
                    checkpoints[`${id}_in`] = input;
                    checkpoints[`${id}_out`] = output;
                }
            });

            const jsonData = {
                timeLimit: timeLimit ? parseInt(timeLimit) : 1000,
                securityCheck: securityCheck,
                enableO2: enableO2,
                compareMode: parseInt(compareMode),
                checkpoints: checkpoints
            };
            const jsonString = JSON.stringify(jsonData, null, 2);
            const highlightedJson = highlightJson(jsonString);
            document.getElementById('jsonPreview').innerHTML = highlightedJson;
        }
        function highlightJson(json) {
            return json
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
                    let cls = 'json-number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'json-key';
                        } else {
                            cls = 'json-string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'json-boolean';
                    } else if (/null/.test(match)) {
                        cls = 'json-null';
                    }
                    return '<span class="' + cls + '">' + match + '</span>';
                });
        }
        function copyJsonToClipboard() {
            const jsonText = document.getElementById('jsonPreview').textContent;
            navigator.clipboard.writeText(jsonText).then(() => {
                const copyButton = document.getElementById('copyJson');
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="fas fa-check"></i> 已复制';
                copyButton.classList.add('btn-success');
                copyButton.classList.remove('btn-outline-secondary');
                
                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                    copyButton.classList.remove('btn-success');
                    copyButton.classList.add('btn-outline-secondary');
                }, 2000);
            });
        }
        function downloadJsonFile() {
            const jsonText = document.getElementById('jsonPreview').textContent;
            const blob = new Blob([jsonText], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'problem_config.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        function resetForm() {
            if (confirm('确定要重置表单吗？所有输入数据将被清除。')) {
                document.getElementById('configForm').reset();
                document.getElementById('testCases').innerHTML = '';
                testCaseCount = 0;
                addTestCase();
                updateJsonPreview();
            }
        }
    
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('addTestCase').addEventListener('click', addTestCase);
            addTestCase();
            document.getElementById('timeLimit').addEventListener('input', updateJsonPreview);
            document.getElementById('securityCheck').addEventListener('change', updateJsonPreview);
            document.getElementById('enableO2').addEventListener('change', updateJsonPreview);
            document.getElementById('compareMode').addEventListener('change', updateJsonPreview);
            document.getElementById('copyJson').addEventListener('click', copyJsonToClipboard);
            document.getElementById('downloadJson').addEventListener('click', downloadJsonFile);
            document.getElementById('resetForm').addEventListener('click', resetForm);
            updateJsonPreview();
        });