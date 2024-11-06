"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categories, setCategories] = useState<string[]>([]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEdit = async (expense: Expense) => {
    console.log("Edit expense:", expense);
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExpenses(data);
        const uniqueCategories: string[] = Array.from(
          new Set(data.map((expense: Expense) => expense.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        selectedCategory === "all" || expense.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
      }
    });
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <select
          className="border rounded p-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option key="all" value="all">
            All Categories
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newSortOrder] = e.target.value.split("-") as [
              "date" | "amount",
              "asc" | "desc"
            ];
            setSortBy(newSortBy);
            setSortOrder(newSortOrder);
          }}
        >
          <option key="date-desc" value="date-desc">
            Date (Newest)
          </option>
          <option key="date-asc" value="date-asc">
            Date (Oldest)
          </option>
          <option key="amount-desc" value="amount-desc">
            Amount (Highest)
          </option>
          <option key="amount-asc" value="amount-asc">
            Amount (Lowest)
          </option>
        </select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{format(new Date(expense.date), "PP")}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>
                <span className="inline-block w-3 h-3 rounded-full mr-2" />
                {expense.category}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
