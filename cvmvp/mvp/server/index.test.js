import request from 'supertest';
import app from './index.js'

describe('Event Management API', () => {
  it('GET /api/events - should return a list of events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('DELETE /api/events/:id - should delete an event', async () => {
    const newEvent = {
      date: 'November 10',
      time: '9 pm',
      ticketPrice: '$30',
      bandName: 'Russian Circles',
      venueName: 'Wonder Ballroom',
      venueAddress: '128 NE Russell St, Portland, OR 97212',
    };
    const createRes = await request(app)
      .post('/api/events')
      .send(newEvent);

    const { id } = createRes.body;

    const deleteRes = await request(app).delete(`/api/events/${id}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body).toHaveProperty('id', id);
  });
});
