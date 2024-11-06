"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ExpenseData {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const categoryColor: Record<string, string> = {
  Food: "red",
  Transport: "green",
  Entertainment: "blue",
};

export function ExpenseOverview() {
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [budget, setBudget] = useState<number | null>(null);
  const ref = useRef("");

  useEffect(() => {
    const fetchData = async () => {
      const [expensesRes] = await Promise.all([fetch("/api/expenses")]);

      const expensesData = await expensesRes.json();

      setExpenses(expensesData);
    };

    fetchData();
  }, []);

  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(
    (expense) => new Date(expense.date).getMonth() === currentMonth
  );

  const totalSpent = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryData = currentMonthExpenses.reduce((acc, expense) => {
    const categoryName = expense.category;
    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        value: 0,
        color: categoryColor[expense.category],
      };
    }
    acc[categoryName].value += expense.amount;
    return acc;
  }, {} as Record<string, { name: string; value: number; color: string }>);

  const chartData = Object.values(categoryData);

  const budgetPercentage = budget ? (totalSpent / budget) * 100 : 0;
  const isOverBudget = budget ? totalSpent > budget : false;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Overview</h2>
        <div className="flex flex-col gap-2 mb-2">
          <Input onChange={(e) => (ref.current = e.target.value)}></Input>
          <Button
            onClick={() => {
              setBudget(Number(ref.current));
            }}
          >
            Set Budget
          </Button>
        </div>

        <div className="space-y-2">
          <p>Total Spent: {formatCurrency(totalSpent)}</p>
          {budget && (
            <>
              <p>Budget: {formatCurrency(budget)}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    isOverBudget ? "bg-red-600" : "bg-green-600"
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
              {isOverBudget && (
                <p className="text-red-600 text-sm">
                  Warning: Over budget by {formatCurrency(totalSpent - budget)}
                </p>
              )}
            </>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Expense Distribution</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
