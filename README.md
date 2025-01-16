# Linear Programming (LP) Dual Problem Solver

This project is a web-based application designed to solve Linear Programming (LP) problems by converting them into their dual forms and solving them using optimization techniques. It allows users to input a linear programming problem, convert it to its dual, and then solve both the primal and dual problems.

The application uses **Python** for the backend, powered by the **Flask** web framework, and the **Gurobi** optimization library to solve the problems. The frontend is built with **HTML**, **CSS**, and **JavaScript** (Bootstrap for styling).

## Features
- **Dual Problem Conversion**: Converts an LP problem to its dual form.
- **Optimization Solver**: Solves the primal and dual LP problems using **Gurobi** (a powerful optimization solver).
- **Objective Functions**: Supports both **maximization** and **minimization** objective functions.
- **Responsive UI**: Simple web interface for input and results using **Bootstrap**.
- **Error Handling**: Handles infeasibility, unbounded solutions, and other optimization errors with descriptive error messages.

## Technologies Used
- **Frontend**: 
  - HTML
  - CSS
  - JavaScript (Bootstrap for styling)
- **Backend**: 
  - Python
  - Flask web framework
  - Gurobi optimizer for linear programming problems
- **Data Format**: JSON (for communication between the frontend and backend)
- **Additional Tools**:
  - **Bootstrap** for responsive and user-friendly design
  - **Gurobi** optimization library for solving the LP problems

## Installation Guide

### 1. Clone the Repository
First, clone the repository to your local machine:
```bash
git clone https://github.com/your-username/your-repository-name.git
```


### 2. Set Up a Virtual Environment
To avoid conflicts with other Python projects, it’s recommended to create a virtual environment:
```bash
python -m venv venv
```

Activate the virtual environment:
- On Windows:
  ```bash
  .\venv\Scripts\activate
  ```
- On macOS/Linux:
  ```bash
  source venv/bin/activate
  ```

### 3. Install Required Python Libraries
Install the necessary Python libraries using `pip`:
```bash
pip install -r requirements.txt
```

The `requirements.txt` file includes all the necessary dependencies, including **Flask** and **Gurobi**.

> **Note**: You must have **Gurobi** installed and properly set up in your environment. For installation instructions, visit [Gurobi Installation Guide](https://www.gurobi.com/documentation/).

### 4. Run the Application
Once the dependencies are installed, run the Flask app:
```bash
python app.py
```

The application will start running locally, and you can access it at `http://127.0.0.1:5000/` in your web browser.

## How to Use

1. **Input**: On the main page, you can input the following data:
   - **Number of Variables**: Enter the number of variables in your linear programming problem.
   - **Number of Constraints**: Enter the number of constraints in the problem.
   - **Objective Function Coefficients**: Enter the coefficients of the objective function.
   - **Constraints**: Enter the coefficients and right-hand side values for each constraint.
   - **Maximization/Minimization**: Choose whether the problem is a maximization or minimization problem.

2. **Solve**: After inputting the problem data, click the **Solve** button to submit the problem. The backend will process the problem, convert it to its dual, and solve both the primal and dual problems using the **Gurobi** optimizer.

3. **Output**: The results will be displayed as:
   - The **optimal solution** values for the variables.
   - The **optimal objective value** (the result of the objective function).
   - If the problem is **infeasible** or **unbounded**, appropriate error messages will be shown.

## Common Error Messages
- **Infeasible Problem**: The problem has no solution.
- **Unbounded Problem**: The objective function tends to infinity.
- **Time Limit Exceeded**: The solver couldn't find the optimal solution within the given time.
- **Optimization Interrupted**: The solver was interrupted during the optimization process.

## Example Usage

Here is an example of how to input an LP problem:

- **Objective Function**: Maximize `3x + 2y`
- **Constraints**:
  - `x + y <= 4`
  - `2x + y <= 5`
  - `x >= 0`, `y >= 0`

Once the problem is inputted, the **Solve** button will calculate and return the optimal solution.

## Troubleshooting

- **Gurobi License**: Ensure that **Gurobi** is installed and you have a valid license key. Follow the [Gurobi Installation Guide](https://www.gurobi.com/documentation/) to set it up.
- **Missing Dependencies**: If you encounter issues with missing Python libraries, make sure you've run `pip install -r requirements.txt` in your virtual environment.

## Contributing

If you want to contribute to this project, feel free to fork the repository and submit a pull request. Any contributions, bug reports, or feature requests are welcome.

### Steps to contribute:
1. Fork the repository.
2. Clone your fork to your local machine.
3. Make changes in your fork.
4. Submit a pull request with a detailed description of your changes.
