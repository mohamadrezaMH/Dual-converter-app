from flask import Flask, render_template, request, jsonify
from gurobipy import Model, GRB


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  # Main HTML page in the templates folder

@app.route('/solve', methods=['POST'])
def solve():
    try:
        # Receive input data
        data = request.get_json()

        # Extract data
        num_variables = int(data.get('numVariables'))
        num_constraints = int(data.get('numConstraints'))
        objective_coefficients = data.get('objectiveCoefficients', [])
        constraints = data.get('constraints', [])
        is_maximization = data.get('isMaximization', True)  # Default is maximization

        # Validate the data
        if len(objective_coefficients) != num_variables or len(constraints) != num_constraints:
            return jsonify({'status': 'error', 'message': 'Invalid input dimensions'})

        # Create the Gurobi model
        model = Model()

        # Add variables
        vars = []
        for i in range(num_variables):
            var = model.addVar(vtype=GRB.CONTINUOUS, name=f"x{i+1}")
            vars.append(var)

        # Set the objective function
        if is_maximization:
            model.setObjective(sum(objective_coefficients[i] * vars[i] for i in range(num_variables)), GRB.MAXIMIZE)
        else:
            model.setObjective(sum(objective_coefficients[i] * vars[i] for i in range(num_variables)), GRB.MINIMIZE)

        # Add constraints
        for constraint in constraints:
            coefficients = constraint.get('coefficients', [])
            rhs_val = constraint.get('rhs', 0)
            sign = constraint.get('sign', '<=')

            # Convert the constraint to a format suitable for Gurobi
            expr = sum(coefficients[i] * vars[i] for i in range(len(coefficients)))
            if sign == '<=':
                model.addConstr(expr <= rhs_val)
            elif sign == '>=':
                model.addConstr(expr >= rhs_val)
            elif sign == '=':
                model.addConstr(expr == rhs_val)

        # Solve the model
        model.optimize()

        # Check the status of the solution
        if model.status == GRB.OPTIMAL or model.Status == 2:
            solution = [var.x for var in vars]
            objective_value = model.objVal
            return jsonify({
                'status': 'success',
                'message': 'LP problem has been solved!',
                'solution': solution,
                'objective_value': objective_value
            })

        elif model.status == GRB.INFEASIBLE or model.Status == 3:
            return jsonify({
                'status': 'error',
                'message': 'The problem is infeasible (no solution exists).'
            })

        elif model.status == GRB.UNBOUNDED or model.Status == 5:
            return jsonify({
                'status': 'error',
                'message': 'The problem is unbounded (solution tends to infinity).'
            })

        elif model.status == GRB.TIME_LIMIT or model.Status == 9:
            return jsonify({
                'status': 'error',
                'message': 'Time limit reached before finding optimal solution.'
            })

        elif model.status == GRB.INTERRUPTED or model.Status == 11:
            return jsonify({
                'status': 'error',
                'message': 'The optimization process was interrupted.'
            })

        elif model.status == 4:
            return jsonify({
                'status': 'error',
                'message': 'The problem is infeasible (no solution exists) or unbounded (solution tends to infinity)'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': f"Unknown error occurred with status {model.status}"
            })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
