import dbConnect from "@/app/api/lib/dbConnect";
import Subscription from '@/app/api/models/Subscription';
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID requis' },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findOne({ userId });
    
    if (!subscription) {
      return NextResponse.json(
        { hasValidSubscription: false, subscriptionType: null },
        { status: 200 }
      );
    }

    // Vérifiez si l'abonnement est valide (non "Null")
const hasValidSubscription = subscription.subscriptionType !== "Null";

    return NextResponse.json(
      { 
        hasValidSubscription,
        subscriptionType: subscription.subscriptionType 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur vérification abonnement:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la vérification de l\'abonnement' },
      { status: 500 }
    );
  }
}