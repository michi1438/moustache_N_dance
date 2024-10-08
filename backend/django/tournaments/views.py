from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Tournament
from .serializers import TournamentSerializer

# LISTER LES TOURNOIS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_tournaments(request):
    try:
        tournaments = Tournament.objects.select_related('created_by').prefetch_related('participants').all()
        serializer = TournamentSerializer(tournaments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f"{type(e).__name__}: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

# CREER UN TOURNOI
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_tournament(request):
    try:
        if Tournament.objects.filter(status__in=['ongoing', 'upcoming']).exists():
            return Response({"error": "Cannot create. A tournament is already ongoing or upcoming"}, status=status.HTTP_400_BAD_REQUEST)

        player = request.user

        serializer = TournamentSerializer(data=request.data)
        if serializer.is_valid():
            tournament = serializer.save(created_by=player)
            tournament.participants.add(player)
            return Response({"tournament_id" : tournament.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': f"{type(e).__name__}: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

# LISTER LES DETAILS, MODIFIER LES INFOS, SUPPRIMER UN TOURNOI
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def tournament_details(request, tournament_id):
    try:
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": f'Tournament with id {tournament_id} does not exist'},status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = TournamentSerializer(tournament)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            serializer = TournamentSerializer(tournament, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            tournament.delete()
            return Response({"message": "Tournament deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response(
            {'error': f"{type(e).__name__}: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

# AJOUTER PARTICIPANT
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_participant(request, tournament_id):
    try:
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except Tournament.DoesNotExist:
            return Response({"error": f'Tournament with id {tournament_id} does not exist'},status=status.HTTP_404_NOT_FOUND)
        
        player = request.user

        if player in tournament.participants.all():
            return Response({"error": f'Player {player.username} is already a participant'}, status=status.HTTP_400_BAD_REQUEST)

        # Verifier si le nombre de player est egal au tournamenet size
        # si c'est le cas, mettre a jour le status a ongoing et ne plus laisser de players rejoindre
        if len(tournament.participants.all()) < tournament.tournament_size:
            tournament.participants.add(player)
            if len(tournament.participants.all()) == tournament.tournament_size:
                tournament.status = "ongoing"
                tournament.save()
        else:
            return Response({"error": "Tournament already full"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": f'Player {player.username} added successfully to tournament {tournament.id}'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {'error': f"{type(e).__name__}: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )
