package handler

import (
	"database/sql"
	"strings"
)

func toNullString(s *string) sql.NullString {
	if s == nil {
		return sql.NullString{
			Valid: false,
		}
	}

	if *s == "" {
		return sql.NullString{
			Valid: false,
		}
	}

	return sql.NullString{
		String: *s,
		Valid:  true,
	}
}

func slug(s string) string {
	s = strings.ToLower(s)
	s = strings.ReplaceAll(s, " ", "_")
	s = strings.ReplaceAll(s, "/", "")
	s = strings.ReplaceAll(s, "\\", "")
	return s
}
