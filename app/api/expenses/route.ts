import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { expenseSchema } from '@/schemas'

export async function POST(req: Request) {
    try {
        const json = await req.json()
        const body = expenseSchema.parse(json)

        const expense = await prisma.expense.create({
            data: {
                description: body.description,
                amount: body.amount,
                date: new Date(body.date),
                category: body.category
            },
        })

        return NextResponse.json(expense)
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        )
    }
}

export async function GET() {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: {
                date: 'desc'
            }
        })

        return NextResponse.json(expenses)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch expenses' },
            { status: 500 }
        )
    }
}