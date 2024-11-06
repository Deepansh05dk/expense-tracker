import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { expenseSchema } from '@/schemas'

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const json = await req.json()
        const body = expenseSchema.parse(json)

        const expense = await prisma.expense.update({
            where: { id: params.id },
            data: {
                description: body.description,
                amount: body.amount,
                date: new Date(body.date),
                category: body.category // Updated field name
            }
        })

        return NextResponse.json(expense)
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.expense.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete expense' },
            { status: 500 }
        )
    }
}
