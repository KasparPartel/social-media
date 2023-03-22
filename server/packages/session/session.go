package session

import (
	"net/http"
	"social-network/packages/errorHandler"
	"sync"
	"time"

	uuid "github.com/satori/go.uuid"
)

type Session struct {
	token      string
	uid        int           //user id
	expireTime time.Time     //time of session creation/update
	lifeTime   time.Duration //time after which session dies
}

type Provider struct {
	mu          sync.Mutex
	sessionsMap map[string]*Session
}

var SessionProvider Provider

func (m *Provider) SetToken(newSessionId string, w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:     "TOKEN",
		Value:    newSessionId,
		Expires:  time.Now().Add(time.Hour * 8760), // 1 year
		MaxAge:   31536000,
		HttpOnly: true,
		Path:     "/",
	})
}

func (m *Provider) getToken(r *http.Request) (string, error) {
	cookie, err := r.Cookie("TOKEN")
	if err != nil {
		return "", err
	}

	sessionId := cookie.Value

	return sessionId, nil
}

func (m *Provider) RemoveToken(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:   "TOKEN",
		MaxAge: -1,
		Path:   "/",
	})
}

func (m *Provider) AddSession(userId int) string {
	m.mu.Lock()
	defer m.mu.Unlock()

	for sessionId, session := range SessionProvider.sessionsMap {
		if session.uid == userId {
			return sessionId
		}
	}

	newSessionId := uuid.NewV4().String()
	m.sessionsMap[newSessionId] = &Session{
		token:      newSessionId,
		uid:        userId,
		expireTime: time.Now(),
		lifeTime:   time.Second * 300,
	}

	return newSessionId
}

func (m *Provider) GetSession(r *http.Request) (*Session, error) {
	sessionId, err := SessionProvider.getToken(r)

	if userSession, exists := m.sessionsMap[sessionId]; exists && err == nil {
		if time.Since(userSession.expireTime) < userSession.lifeTime {
			userSession.expireTime = time.Now()
			return userSession, nil
		}
		userSession.SessionRemove()

		return nil, errorHandler.NewErrorResponse(errorHandler.ErrSessionExpired, "session expired")
	}

	return nil, errorHandler.NewErrorResponse(errorHandler.ErrSessionNotExist, "session doesn't exist")
}

func (s Session) GetUID() int {
	return s.uid
}

func (s *Session) SessionRemove() {
	SessionProvider.mu.Lock()
	defer SessionProvider.mu.Unlock()

	delete(SessionProvider.sessionsMap, s.token)
}

func (m *Provider) checkExpires() {
	for {
		time.Sleep(time.Second * 60)

		for _, session := range SessionProvider.sessionsMap {
			if time.Since(session.expireTime) >= session.lifeTime {
				session.SessionRemove()
			}
		}
	}
}

func init() {
	SessionProvider = Provider{
		sessionsMap: make(map[string]*Session),
	}

	go SessionProvider.checkExpires()
}
