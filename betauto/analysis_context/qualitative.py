from __future__ import annotations

from .models import QualitativeContext, QualitativeSourceContext


LEAGUE_MEDIA_DIRECTORY: dict[int, list[dict[str, object]]] = {
    39: [
        {"source_id": "MED-059", "media_name": "Sky Sports", "priority_rank": 1, "language": "en"},
        {"source_id": "MED-011", "media_name": "BBC Sport", "priority_rank": 2, "language": "en"},
        {"source_id": "MED-072", "media_name": "The Athletic", "priority_rank": 3, "language": "en"},
    ],
    40: [
        {"source_id": "MED-059", "media_name": "Sky Sports", "priority_rank": 1, "language": "en"},
        {"source_id": "MED-072", "media_name": "The Athletic", "priority_rank": 2, "language": "en"},
    ],
    61: [
        {"source_id": "MED-033", "media_name": "L'Equipe", "priority_rank": 1, "language": "fr"},
        {"source_id": "MED-051", "media_name": "RMC Sport", "priority_rank": 2, "language": "fr"},
        {"source_id": "MED-023", "media_name": "Foot Mercato", "priority_rank": 3, "language": "fr"},
    ],
    62: [
        {"source_id": "MED-033", "media_name": "L'Equipe", "priority_rank": 1, "language": "fr"},
        {"source_id": "MED-039", "media_name": "MaLigue2", "priority_rank": 2, "language": "fr"},
    ],
    71: [
        {"source_id": "MED-030", "media_name": "Globo Esporte", "priority_rank": 1, "language": "pt"},
        {"source_id": "MED-035", "media_name": "Lance!", "priority_rank": 2, "language": "pt"},
    ],
    78: [
        {"source_id": "MED-032", "media_name": "Kicker", "priority_rank": 1, "language": "de"},
        {"source_id": "MED-062", "media_name": "Sport Bild", "priority_rank": 2, "language": "de"},
    ],
    79: [
        {"source_id": "MED-032", "media_name": "Kicker", "priority_rank": 1, "language": "de"},
        {"source_id": "MED-062", "media_name": "Sport Bild", "priority_rank": 2, "language": "de"},
    ],
    88: [
        {"source_id": "MED-080", "media_name": "Voetbal International", "priority_rank": 1, "language": "nl"},
        {"source_id": "MED-003", "media_name": "AD Sportwereld", "priority_rank": 2, "language": "nl"},
    ],
    94: [
        {"source_id": "MED-001", "media_name": "A Bola", "priority_rank": 1, "language": "pt"},
        {"source_id": "MED-053", "media_name": "Record", "priority_rank": 2, "language": "pt"},
        {"source_id": "MED-047", "media_name": "O Jogo", "priority_rank": 3, "language": "pt"},
    ],
    95: [
        {"source_id": "MED-001", "media_name": "A Bola", "priority_rank": 1, "language": "pt"},
        {"source_id": "MED-053", "media_name": "Record", "priority_rank": 2, "language": "pt"},
    ],
    98: [
        {"source_id": "MED-060", "media_name": "Soccer King", "priority_rank": 1, "language": "ja"},
        {"source_id": "MED-046", "media_name": "Nikkan Sports", "priority_rank": 2, "language": "ja"},
    ],
    103: [
        {"source_id": "MED-079", "media_name": "VG Sporten", "priority_rank": 1, "language": "no"},
        {"source_id": "MED-016", "media_name": "Dagbladet Sport", "priority_rank": 2, "language": "no"},
    ],
    106: [
        {"source_id": "MED-050", "media_name": "Przeglad Sportowy", "priority_rank": 1, "language": "pl"},
        {"source_id": "MED-070", "media_name": "TVP Sport", "priority_rank": 2, "language": "pl"},
    ],
    110: [
        {"source_id": "MED-056", "media_name": "Sgorio", "priority_rank": 1, "language": "cy"},
    ],
    113: [
        {"source_id": "MED-025", "media_name": "Fotbollskanalen", "priority_rank": 1, "language": "sv"},
        {"source_id": "MED-006", "media_name": "Aftonbladet Sport", "priority_rank": 2, "language": "sv"},
    ],
    119: [
        {"source_id": "MED-014", "media_name": "Bold.dk", "priority_rank": 1, "language": "da"},
        {"source_id": "MED-074", "media_name": "Tipsbladet", "priority_rank": 2, "language": "da"},
    ],
    128: [
        {"source_id": "MED-048", "media_name": "Ole", "priority_rank": 1, "language": "es"},
        {"source_id": "MED-077", "media_name": "TyC Sports", "priority_rank": 2, "language": "es"},
    ],
    135: [
        {"source_id": "MED-034", "media_name": "La Gazzetta dello Sport", "priority_rank": 1, "language": "it"},
        {"source_id": "MED-058", "media_name": "Sky Sport Italia", "priority_rank": 2, "language": "it"},
    ],
    136: [
        {"source_id": "MED-034", "media_name": "La Gazzetta dello Sport", "priority_rank": 1, "language": "it"},
        {"source_id": "MED-058", "media_name": "Sky Sport Italia", "priority_rank": 2, "language": "it"},
    ],
    140: [
        {"source_id": "MED-040", "media_name": "Marca", "priority_rank": 1, "language": "es"},
        {"source_id": "MED-004", "media_name": "AS", "priority_rank": 2, "language": "es"},
        {"source_id": "MED-043", "media_name": "Mundo Deportivo", "priority_rank": 3, "language": "es"},
    ],
    141: [
        {"source_id": "MED-040", "media_name": "Marca", "priority_rank": 1, "language": "es"},
        {"source_id": "MED-004", "media_name": "AS", "priority_rank": 2, "language": "es"},
    ],
    144: [
        {"source_id": "MED-067", "media_name": "Sporza", "priority_rank": 1, "language": "nl"},
        {"source_id": "MED-015", "media_name": "DH Les Sports", "priority_rank": 2, "language": "fr"},
    ],
    164: [
        {"source_id": "MED-027", "media_name": "Fotbolti.net", "priority_rank": 1, "language": "is"},
    ],
    169: [
        {"source_id": "MED-075", "media_name": "Titan Sports", "priority_rank": 1, "language": "zh"},
    ],
    172: [
        {"source_id": "MED-064", "media_name": "Sportal.bg", "priority_rank": 1, "language": "bg"},
    ],
    179: [
        {"source_id": "MED-017", "media_name": "Daily Record Sport", "priority_rank": 1, "language": "en"},
        {"source_id": "MED-012", "media_name": "BBC Sport Scotland", "priority_rank": 2, "language": "en"},
    ],
    197: [
        {"source_id": "MED-029", "media_name": "Gazzetta.gr", "priority_rank": 1, "language": "el"},
        {"source_id": "MED-063", "media_name": "Sport24", "priority_rank": 2, "language": "el"},
    ],
    203: [
        {"source_id": "MED-022", "media_name": "Fanatik", "priority_rank": 1, "language": "tr"},
        {"source_id": "MED-026", "media_name": "Fotomac", "priority_rank": 2, "language": "tr"},
    ],
    207: [
        {"source_id": "MED-013", "media_name": "Blick Sport", "priority_rank": 1, "language": "de"},
        {"source_id": "MED-076", "media_name": "Tribune de Geneve", "priority_rank": 2, "language": "fr"},
    ],
    210: [
        {"source_id": "MED-066", "media_name": "Sportske novosti", "priority_rank": 1, "language": "hr"},
    ],
    218: [
        {"source_id": "MED-036", "media_name": "Laola1", "priority_rank": 1, "language": "de"},
        {"source_id": "MED-057", "media_name": "Sky Sport Austria", "priority_rank": 2, "language": "de"},
    ],
    235: [
        {"source_id": "MED-024", "media_name": "Football.ua", "priority_rank": 1, "language": "uk"},
        {"source_id": "MED-078", "media_name": "UA-Football", "priority_rank": 2, "language": "uk"},
    ],
    239: [
        {"source_id": "MED-081", "media_name": "Win Sports", "priority_rank": 1, "language": "es"},
        {"source_id": "MED-031", "media_name": "Gol Caracol", "priority_rank": 2, "language": "es"},
    ],
    240: [
        {"source_id": "MED-068", "media_name": "StudioFutbol", "priority_rank": 1, "language": "es"},
        {"source_id": "MED-021", "media_name": "El Universo", "priority_rank": 2, "language": "es"},
    ],
    244: [
        {"source_id": "MED-082", "media_name": "Yle Urheilu", "priority_rank": 1, "language": "fi"},
        {"source_id": "MED-069", "media_name": "SuomiFutis", "priority_rank": 2, "language": "fi"},
    ],
    253: [
        {"source_id": "MED-038", "media_name": "MLSsoccer.com", "priority_rank": 1, "language": "en"},
        {"source_id": "MED-019", "media_name": "ESPN FC", "priority_rank": 2, "language": "en"},
        {"source_id": "MED-072", "media_name": "The Athletic", "priority_rank": 3, "language": "en"},
    ],
    262: [
        {"source_id": "MED-055", "media_name": "Record", "priority_rank": 1, "language": "es"},
        {"source_id": "MED-041", "media_name": "MedioTiempo", "priority_rank": 2, "language": "es"},
    ],
    265: [
        {"source_id": "MED-054", "media_name": "RedGol", "priority_rank": 1, "language": "es"},
        {"source_id": "MED-007", "media_name": "Al Aire Libre", "priority_rank": 2, "language": "es"},
    ],
    271: [
        {"source_id": "MED-045", "media_name": "Nemzeti Sport", "priority_rank": 1, "language": "hu"},
    ],
    283: [
        {"source_id": "MED-028", "media_name": "Gazeta Sporturilor", "priority_rank": 1, "language": "ro"},
        {"source_id": "MED-049", "media_name": "ProSport", "priority_rank": 2, "language": "ro"},
    ],
    284: [
        {"source_id": "MED-002", "media_name": "ABC Color", "priority_rank": 1, "language": "es"},
        {"source_id": "MED-073", "media_name": "Tigo Sports", "priority_rank": 2, "language": "es"},
    ],
    286: [
        {"source_id": "MED-042", "media_name": "Mozzart Sport", "priority_rank": 1, "language": "sr"},
    ],
    292: [
        {"source_id": "MED-044", "media_name": "Naver Sports", "priority_rank": 1, "language": "ko"},
        {"source_id": "MED-065", "media_name": "Sports Seoul", "priority_rank": 2, "language": "ko"},
    ],
    307: [
        {"source_id": "MED-010", "media_name": "Arriyadiyah", "priority_rank": 1, "language": "ar"},
        {"source_id": "MED-008", "media_name": "Al Riyadiya", "priority_rank": 2, "language": "ar"},
    ],
    327: [
        {"source_id": "MED-061", "media_name": "Soccernet.ee", "priority_rank": 1, "language": "et"},
    ],
    329: [
        {"source_id": "MED-005", "media_name": "Adjarasport", "priority_rank": 1, "language": "ka"},
        {"source_id": "MED-037", "media_name": "Lelo", "priority_rank": 2, "language": "ka"},
    ],
    331: [
        {"source_id": "MED-009", "media_name": "Alyga.lt", "priority_rank": 1, "language": "lt"},
    ],
    334: [
        {"source_id": "MED-083", "media_name": "Sport.sk", "priority_rank": 1, "language": "sk"},
    ],
    345: [
        {"source_id": "MED-028", "media_name": "Gazeta Sporturilor", "priority_rank": 1, "language": "ro"},
        {"source_id": "MED-018", "media_name": "Digi Sport", "priority_rank": 2, "language": "ro"},
    ],
    357: [
        {"source_id": "MED-071", "media_name": "The 42", "priority_rank": 1, "language": "en"},
        {"source_id": "MED-052", "media_name": "RTE Sport", "priority_rank": 2, "language": "en"},
    ],
    373: [
        {"source_id": "MED-020", "media_name": "Ekipa24", "priority_rank": 1, "language": "sl"},
    ],
}


def empty_qualitative_context(league_id: int | None = None) -> QualitativeContext:
    preferred_media = [
        QualitativeSourceContext(
            source_id=str(item.get("source_id") or ""),
            media_name=str(item.get("media_name") or ""),
            priority_rank=int(item["priority_rank"]) if item.get("priority_rank") is not None else None,
            language=str(item.get("language") or "") or None,
            scope="league",
            reliability="preferred_reference",
        )
        for item in LEAGUE_MEDIA_DIRECTORY.get(league_id or -1, [])
    ]
    return QualitativeContext(
        available=False,
        collection_status="not_collected",
        preferred_media=preferred_media,
        consulted_sources=[],
        signals=[],
        missing_dimensions=[
            "team_news",
            "coach_quotes",
            "travel_fatigue",
            "weather",
            "schedule_pressure",
            "motivation_context",
        ],
        source_notes=["No qualitative collection has been performed for this match yet."],
    )


def build_manual_qualitative_context(manual_notes: list[str] | None = None) -> QualitativeContext:
    context = empty_qualitative_context()
    context.manual_notes = manual_notes or []
    context.collection_status = "manual_only"
    return context
