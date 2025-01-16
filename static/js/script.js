let dualNumVariables = 0;       
let dualNumConstraints = 0;    
let dualObjectiveCoefficients = []; 
let dualConstraints = [];       
let dualSigns = [];             
let dualIsMaximization = false; 

document.addEventListener("DOMContentLoaded", function () {
    // Step 1: Handle the Next Step button for Step 1
    document.getElementById('next-step1').addEventListener('click', function() {
        const numVariables = document.getElementById('num-variables').value;
        const numConstraints = document.getElementById('num-constraints').value;

        if (!numVariables || !numConstraints || numVariables <= 0) {
            alert('Please fill in all the fields. Number of variables must be greater than 0.');
            return;
        }

        // Switch to step 2
        document.getElementById('step2').style.display = 'block';
        generateObjectiveFunctionInputs(numVariables);
    });

    // Step 2: Handle the Next Step button for Step 2
    document.getElementById('next-step2').addEventListener('click', function() {
        const numVariables = document.getElementById('num-variables').value;
        const numConstraints = document.getElementById('num-constraints').value;

        const objectiveCoefficients = [];
        for (let i = 0; i < numVariables; i++) {
            const coef = document.getElementById(`objective-coef-${i}`).value;
            if (!coef) {
                alert('Please fill in all coefficients for the objective function.');
                return;
            }
            objectiveCoefficients.push(coef);
        }

        // Switch to step 3
        document.getElementById('step3').style.display = 'block';
        generateConstraintsInputs(numVariables, numConstraints);
        generateVariableSignsInputs(numVariables);
    });

    // Step 3: Handle the Compute Dual button
    document.getElementById('compute-dual').addEventListener('click', function() {
        const numVariables = document.getElementById('num-variables').value;
        const numConstraints = document.getElementById('num-constraints').value;

        const objectiveCoefficients = [];
        for (let i = 0; i < numVariables; i++) {
            const coef = document.getElementById(`objective-coef-${i}`).value;
            objectiveCoefficients.push(coef);
        }

        const constraints = [];
        for (let i = 0; i < numConstraints; i++) {
            const constraintCoefficients = [];
            for (let j = 0; j < numVariables; j++) {
                const coef = document.getElementById(`constraint-coef-${i}-${j}`).value;
                constraintCoefficients.push(coef);
            }
            const rhs = document.getElementById(`rhs-${i}`).value;
            const sign = document.getElementById(`constraint-sign-${i}`).value;
            constraints.push({ coefficients: constraintCoefficients, rhs, sign });
        }

        const variableSigns = [];
        for (let i = 0; i < numVariables; i++) {
            const sign = document.getElementById(`variable-sign-${i}`).value;
            variableSigns.push(sign);
        }

        const isMaximization = document.getElementById('objective-type').value === 'max';
        const dualProblem = generateDualProblem(objectiveCoefficients, constraints, variableSigns, isMaximization);
        displayDualProblem(dualProblem);
    });
});

function generateObjectiveFunctionInputs(numVariables) {
    const variableInputsDiv = document.getElementById('variable-coefficients');
    variableInputsDiv.innerHTML = ''; // Clear any existing inputs

    const row = document.createElement('div');
    row.classList.add('row');
    row.innerHTML = `
        <label for="problem-type" class="col-sm-2 col-form-label">Coefficients:</label>
    `;
    for (let i = 0; i < numVariables; i++) {
        const inputDiv = document.createElement('div');
        inputDiv.classList.add('col-sm-2');
        inputDiv.innerHTML = `
            <input type="number" class="form-control" id="objective-coef-${i}" placeholder="x${i + 1}">
        `;
        row.appendChild(inputDiv);
    }
    variableInputsDiv.appendChild(row);
}

function generateConstraintsInputs(numVariables, numConstraints) {
    const constraintsInputsDiv = document.getElementById('constraints-inputs');
    constraintsInputsDiv.innerHTML = ''; // Clear any existing inputs

    for (let i = 0; i < numConstraints; i++) {
        const div = document.createElement('div');
        div.classList.add('row');
        div.style.marginTop = "10px";
        div.innerHTML = `<label class="col-sm-2 col-form-label">Constraint ${i + 1}:</label>`;
        
        for (let j = 0; j < numVariables; j++) {
            div.innerHTML += `
                <div class="col-sm-2">
                    <input type="number" class="form-control" id="constraint-coef-${i}-${j}" placeholder="x${j + 1}" required>
                </div>
            `;
        }
        div.innerHTML += `
            <div class="col-sm-2">
                <select class="form-control" id="constraint-sign-${i}">
                    <option value="<="><=</option>
                    <option value=">=">>=</option>
                    <option value="=">=</option>
                </select>
            </div>
        `;
        div.innerHTML += `
            <div class="col-sm-2">
                <input type="number" class="form-control" id="rhs-${i}" placeholder="RHS" required>
            </div>
        `;
        constraintsInputsDiv.appendChild(div);
    }
}

function generateVariableSignsInputs(numVariables) {
    const variableSignsInputsDiv = document.getElementById('variable-signs-inputs');
    variableSignsInputsDiv.innerHTML = ''; // Clear any existing inputs

    const row = document.createElement('div');
    row.classList.add('row');
    row.innerHTML = `
        <label class="col-sm-2 col-form-label">Variable Signs:</label>
    `;
    for (let i = 0; i < numVariables; i++) {
        const selectDiv = document.createElement('div');
        selectDiv.classList.add('col-sm-2');
        selectDiv.innerHTML = `
            <select style="min-width : max-content; margin-top:20px;" class="form-control" id="variable-sign-${i}">
                <option value="<=">x${i+1} : Non-negative</option>
                <option value=">=">x${i+1} : Non-positive</option>
                <option value="free">x${i+1} : Free</option>
            </select>
        `;
        selectDiv.style="margin-right:10%"
        row.appendChild(selectDiv);
    }
    variableSignsInputsDiv.appendChild(row);
}

function generateDualProblem(objectiveCoefficients, constraints, variableSigns, isMaximization) {
    // Set global variables for the dual problem
    dualNumVariables = constraints.length;  // Number of variables equals the number of constraints in the primal problem
    dualNumConstraints = objectiveCoefficients.length; // Number of constraints equals the number of variables in the primal problem
    dualObjectiveCoefficients = constraints.map(constraint => constraint.rhs); // Objective function coefficients for the dual problem
    dualConstraints = []; // Constraints for the dual problem
    dualSigns = [];
    dualIsMaximization = !isMaximization; // Toggle optimization type

    // Create constraints for the dual problem
    for (let i = 0; i < dualNumConstraints; i++) {
        const coefficients = [];
        for (let j = 0; j < dualNumVariables; j++) {
            coefficients.push(constraints[j].coefficients[i]);
        }
        const sign = getDualSign(variableSigns[i], isMaximization); // Constraint sign
        dualConstraints.push({ coefficients, rhs: objectiveCoefficients[i], sign });
    }

    dualSigns = constraints.map(constraint => getDualVariableSign(constraint.sign, isMaximization));

    // Return a readable format for display    
    let dualObjective = `${dualIsMaximization ? 'Maximize:' : 'Minimize:'} `;
    for (let i = 0; i < dualNumVariables; i++) {
        dualObjective += `${constraints[i].rhs} * y<sub>${i + 1}</sub>`;
        if (i < dualNumVariables - 1) dualObjective += ' + ';
    }

    const dualConstraintsText = dualConstraints.map((constraint, index) => {
        let equation = '';
        constraint.coefficients.forEach((coef, i) => {
            equation += `${coef} * y<sub>${i + 1}</sub>`;
            if (i < constraint.coefficients.length - 1) equation += ' + ';
        });
        equation += ` ${constraint.sign} ${constraint.rhs}`;
        return `<li>${equation}</li>`;
    });

    const dualVariableSigns = [];
    for (let i = 0; i < dualNumVariables; i++) {
        dualVariableSigns.push(`y<sub>${i + 1}</sub>: ${getDualVariableSign(constraints[i].sign, dualIsMaximization)}`);
    }
    console.log(dualVariableSigns)

    return `
        <h4>Dual Objective Function:</h4>
        <p>${dualObjective}</p>
        <h4>Dual Constraints:</h4>
        <ul>${dualConstraintsText.join('')}</ul>
        <h4>Dual Variable Signs:</h4>
        <ul>
            ${dualVariableSigns.map(sign => `<li>${sign}</li>`).join('')}
        </ul>
    `;
}



function getDualSign(primalVariableSign, isMaximization) {
    // Determine dual constraint sign based on primal variable sign and problem type
    if (primalVariableSign === '<=') {
        return isMaximization ? '>=' : '<=';       
    }
    if (primalVariableSign === '>=') {
        return isMaximization ? '<=' : '>=';    
    }
    return '='; // Free variable in primal -> equality constraint in dual
}

function getDualVariableSign(primalConstraintSign, isMaximization) {
    // Determine dual variable sign based on primal constraint sign and problem type
    if (primalConstraintSign === '<=') {
        return isMaximization ?  'Non-positive' : 'Non-negative';   //////////
    }
    if (primalConstraintSign === '>=') {
        return isMaximization ? 'Non-negative' : 'Non-positive';
    }
    return 'Free'; // Equality constraint in primal -> free variable in dual
}


function displayDualProblem(dualProblem) {
    document.getElementById('dual-output').innerHTML = dualProblem;
    document.getElementById('compute-dual').addEventListener('click', function() {
        document.getElementById('dual-problem').style.display = 'block';
        });
}
 



///////////////////////////////////////////////////// Solve primal


document.getElementById('solve_primal').addEventListener('click', function() {
    const numVariables = document.getElementById('num-variables').value;
    const numConstraints = document.getElementById('num-constraints').value;

    const objectiveCoefficients = [];
    for (let i = 0; i < numVariables; i++) {
        const coef = document.getElementById(`objective-coef-${i}`).value;
        objectiveCoefficients.push(coef);
    }

    const constraints = [];
    for (let i = 0; i < numConstraints; i++) {
        const constraintCoefficients = [];
        for (let j = 0; j < numVariables; j++) {
            const coef = document.getElementById(`constraint-coef-${i}-${j}`).value;
            constraintCoefficients.push(coef);
        }
        const rhs = document.getElementById(`rhs-${i}`).value;
        const sign = document.getElementById(`constraint-sign-${i}`).value;
        constraints.push({ coefficients: constraintCoefficients, rhs, sign });
    }

    
    const isMax = document.getElementById('objective-type').value === 'max';

    const data = {
        numVariables: numVariables,
        numConstraints: numConstraints,
        objectiveCoefficients: objectiveCoefficients.map(coef => parseFloat(coef)),  
        constraints: constraints.map(constraint => ({
            coefficients: constraint.coefficients.map(coef => parseFloat(coef)),  
            rhs: parseFloat(constraint.rhs),  
            sign: constraint.sign
        })),
        isMaximization: isMax 
        };

    console.log(data)

    fetch('/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) 
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response from server:', data);
    
        const solutionList = document.getElementById('solution-list');
        const objectiveValueElement = document.getElementById('objective-value');
        const solutionOutput = document.getElementById('solution-output');
    
       
        solutionList.innerHTML = '';
        objectiveValueElement.textContent = '';
        solutionOutput.style.display = 'none';
    
        if (data.status === 'success') {
            data.solution.forEach((value, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `x<sub>${index + 1}</sub> = ${value}`;
                solutionList.appendChild(listItem);
            });
            const objectiveVal = document.createElement('li');
            objectiveVal.innerHTML = `z<sup>*</sup> = ${data.objective_value}`;
            objectiveValueElement.appendChild(objectiveVal);
    
            solutionOutput.style.display = 'block';
    
        } else if (data.status === 'warning') {
            alert(data.message); 
    
            data.solution.forEach((value, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `x<sub>${index + 1}</sub> = ${value}`;
                solutionList.appendChild(listItem);
            });
    
            const objectiveVal = document.createElement('li');
            objectiveVal.innerHTML = `z<sup>*</sup> = ${data.objective_value}`;
            objectiveValueElement.appendChild(objectiveVal);
    
            solutionOutput.style.display = 'block';
    
        } else if (data.status === 'error') {
            alert(data.message); 
            objectiveValueElement.textContent = data.message;
            solutionOutput.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while solving the problem.'); 
        objectiveValueElement.textContent = `An error occurred while solving the problem.`;
        solutionOutput.style.display = 'block';
    });
    
    
});


////////////////////////////////////////////////// Solve Dual Problem


document.getElementById('solve_dual').addEventListener('click', function () {
    const dualData = {
        numVariables: dualNumVariables,
        numConstraints: dualNumConstraints,
        objectiveCoefficients: dualObjectiveCoefficients.map(coef => parseFloat(coef)),  
        constraints: dualConstraints.map(constraint => ({
            coefficients: constraint.coefficients.map(coef => parseFloat(coef)), 
            rhs: parseFloat(constraint.rhs), 
            sign: constraint.sign
        })),
        isMaximization: dualIsMaximization 
    };

    console.log("Dual Problem Data:", dualData);

    fetch('/solve', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dualData)  
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server (Dual):', data);

            const dualSolutionList = document.getElementById('dual-solution-list');
            const dualObjectiveValueElement = document.getElementById('dual-objective-value');
            const dualSolutionOutput = document.getElementById('dual-solution-output');

            dualSolutionList.innerHTML = '';
            dualObjectiveValueElement.textContent = '';
            dualSolutionOutput.style.display = 'none';

            if (data.status === 'success') {
                data.solution.forEach((value, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `y<sub>${index + 1}</sub> = ${value}`;
                    dualSolutionList.appendChild(listItem);
                });

                const objVal = document.createElement('li');
                objVal.innerHTML = `w<sup>*</sup> = ${data.objective_value}`;
                dualObjectiveValueElement.appendChild(objVal);

                dualSolutionOutput.style.display = 'block';

            } else if (data.status === 'warning') {
                alert(data.message);
                data.solution.forEach((value, index) => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `y<sub>${index + 1}</sub> = ${value}`;
                    dualSolutionList.appendChild(listItem);
                });
        
                const objVal = document.createElement('li');
                objVal.innerHTML = `w<sup>*</sup> = ${data.objective_value}`;
                dualObjectiveValueElement.appendChild(objVal);
        
                dualSolutionOutput.style.display = 'block';
            } else if (data.status === 'error') {
                alert(data.message); 
                dualObjectiveValueElement.textContent = data.message;
                dualSolutionOutput.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error (Dual):', error);
            alert('An error occurred while solving the dual problem.');
            dualObjectiveValueElement.textContent = `An error occurred while solving the problem.`;
            dualSolutionOutput.style.display = 'block';
        });
});

