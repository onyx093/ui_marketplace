"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PaymentStatusProps {
    orderId: string;
    orderEmail: string;
    isPaid: boolean;
}

const PaymentStatus = ({ orderId, orderEmail, isPaid }: PaymentStatusProps) => {
    const router = useRouter();
    const { data } = trpc.payment.pollOrderStatus.useQuery(
        { orderId },
        {
            enabled: isPaid === false,
            refetchInterval: (data) => (data?.isPaid ? false : 1000),
        }
    );

    useEffect(() => {
        if (data?.isPaid) {
            return router.refresh();
        }
    }, [data?.isPaid, router]);

    return (
        <div className="grid grid-cols-2 gap-x-4 mt-16 text-sm text-gray-600">
            <div>
                <p className="text-gray-900 font-medium">Shipping To</p>
                <p>{orderEmail}</p>
            </div>

            <div>
                <p className="text-gray-900 font-medium">Order Status</p>
                <p>{isPaid ? "Payment successful" : "Pending payment"}</p>
            </div>
        </div>
    );
};

export default PaymentStatus;
