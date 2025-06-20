import { NextResponse } from 'next/server';
import Publication from '@/app/api/models/Publication';
import { connectDB } from '@/app/lib/dbConnect';

// Ajouter/retirer un like
export async function POST(req, { params }) {
  await connectDB();
  const { id } = params;
  const { userId } = await req.json();

  try {
    const publication = await Publication.findById(id);
    if (!publication) {
      return NextResponse.json(
        { error: 'Publication non trouvée' },
        { status: 404 }
      );
    }

    const index = publication.likes.indexOf(userId);
    if (index === -1) {
      // Ajouter le like
      publication.likes.push(userId);
    } else {
      // Retirer le like
      publication.likes.splice(index, 1);
    }

    await publication.save();
    await publication.populate('author', 'name avatar userType');
    await publication.populate('likes', 'name');
    await publication.populate('comments.user', 'name avatar');

    return NextResponse.json(publication);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des likes' },
      { status: 500 }
    );
  }
}

// Ajouter un commentaire
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { userId, text } = await req.json();

  try {
    const publication = await Publication.findById(id);
    if (!publication) {
      return NextResponse.json(
        { error: 'Publication non trouvée' },
        { status: 404 }
      );
    }

    publication.comments.push({
      user: userId,
      text
    });

    await publication.save();
    await publication.populate('author', 'name avatar userType');
    await publication.populate('likes', 'name');
    await publication.populate('comments.user', 'name avatar');

    return NextResponse.json(publication);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du commentaire' },
      { status: 500 }
    );
  }
}