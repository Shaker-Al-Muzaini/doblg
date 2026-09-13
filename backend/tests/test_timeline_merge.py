from fastapi.testclient import TestClient

from main import app
from database import SessionLocal, Base, engine
from models import User, Project, TimelineBlock
from routers.auth import get_password_hash

client = TestClient(app)


def setup_test_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        db.query(TimelineBlock).delete()
        db.query(Project).delete()
        db.query(User).delete()

        user = User(
            id='u-test',
            email='merge@test.com',
            name='Merge Tester',
            hashed_password=get_password_hash('secret123'),
            locale='en',
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        project = Project(
            id='proj-test-merge',
            title='Merge Test Project',
            source_origin='URL',
            source_url='https://example.com/video.mp4',
            owner_id=user.id,
            status='CREATED',
            progress_percentage=0,
            duration_ms=0,
            target_language='ar',
        )
        db.add(project)
        db.commit()
        db.refresh(project)

        block1 = TimelineBlock(
            id='tb-1',
            project_id=project.id,
            sequence_order=1,
            source_text='Hello',
            translated_text='مرحبا',
            start_time_ms=0,
            end_time_ms=1000,
            speaker_label='Speaker 1',
            confidence=0.95,
            status='AUTO',
            timing_delta_pct=1.0,
        )
        block2 = TimelineBlock(
            id='tb-2',
            project_id=project.id,
            sequence_order=2,
            source_text='world',
            translated_text='العالم',
            start_time_ms=1000,
            end_time_ms=2000,
            speaker_label='Speaker 1',
            confidence=0.9,
            status='EDITED',
            timing_delta_pct=2.0,
        )
        db.add_all([block1, block2])
        db.commit()
        return user, project
    finally:
        db.close()


def test_merge_timeline_blocks_real_response():
    setup_test_data()
    login = client.post('/api/v1/auth/login', json={'email': 'merge@test.com', 'password': 'secret123'})
    assert login.status_code == 200, login.text
    token = login.json()['token']

    response = client.post(
        '/api/v1/timeline/blocks/merge',
        headers={'Authorization': f'Bearer {token}'},
        json={'blockIds': ['tb-1', 'tb-2']},
    )

    assert response.status_code == 200, response.text
    body = response.json()
    assert body['sourceText'] == 'Hello world'
    assert body['translatedText'] == 'مرحبا العالم'
    assert body['startTimeMs'] == 0
    assert body['endTimeMs'] == 2000
    assert body['speakerLabel'] == 'Speaker 1'
