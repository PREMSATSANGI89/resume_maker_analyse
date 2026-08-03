import { Box, Stack, Typography, Chip } from '@mui/material';
import type { ReactElement } from 'react';
import { LinkedIn, GitHub, Language, Email, Phone, Room } from '@mui/icons-material';
import type { ResumeData, ResumeSectionKey } from '@/types/resume.types';
import { formatMonthYear } from '@/utils/helpers';

export interface TemplateProps {
  resume: ResumeData;
}

interface HeadingStyle {
  color: string;
  fontFamily: string;
  uppercase?: boolean;
  underline?: boolean;
  size?: string;
}

export type { HeadingStyle };

/** Reusable section heading used across all templates with per-template styling. */
export function TemplateHeading({ children, style }: { children: string; style: HeadingStyle }) {
  return (
    <Typography
      sx={{
        fontFamily: style.fontFamily,
        color: style.color,
        fontWeight: 700,
        fontSize: style.size ?? '13px',
        textTransform: style.uppercase ? 'uppercase' : 'none',
        letterSpacing: style.uppercase ? '0.08em' : 'normal',
        borderBottom: style.underline ? `2px solid ${style.color}` : 'none',
        display: 'inline-block',
        pb: style.underline ? 0.4 : 0,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

export function ContactRow({ resume, iconColor }: { resume: ResumeData; iconColor: string }) {
  const { personalInfo } = resume;
  const items = [
    { icon: <Email sx={{ fontSize: 13 }} />, value: personalInfo.email },
    { icon: <Phone sx={{ fontSize: 13 }} />, value: personalInfo.phone },
    { icon: <Room sx={{ fontSize: 13 }} />, value: personalInfo.location },
    { icon: <LinkedIn sx={{ fontSize: 13 }} />, value: personalInfo.linkedin?.replace(/^https?:\/\//, '') },
    { icon: <GitHub sx={{ fontSize: 13 }} />, value: personalInfo.github?.replace(/^https?:\/\//, '') },
    { icon: <Language sx={{ fontSize: 13 }} />, value: personalInfo.portfolio?.replace(/^https?:\/\//, '') },
  ].filter((i) => i.value);

  return (
    <Stack direction="row" flexWrap="wrap" columnGap={1.75} rowGap={0.5}>
      {items.map((item, i) => (
        <Stack key={i} direction="row" spacing={0.5} alignItems="center" sx={{ color: iconColor }}>
          {item.icon}
          <Typography sx={{ fontSize: '10.5px' }}>{item.value}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export function EducationSection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (resume.education.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Education</TemplateHeading>
      <Stack spacing={1}>
        {resume.education.map((edu) => (
          <Box key={edu.id}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
              <Typography sx={{ fontSize: '11.5px', fontWeight: 700 }}>{edu.college}</Typography>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                {formatMonthYear(edu.startDate)} – {formatMonthYear(edu.endDate)}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '10.5px', color: 'text.secondary' }}>
              {edu.degree}
              {edu.branch ? `, ${edu.branch}` : ''}
              {edu.cgpa ? ` · CGPA: ${edu.cgpa}` : ''}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function ExperienceSection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (resume.experience.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Experience</TemplateHeading>
      <Stack spacing={1.25}>
        {resume.experience.map((exp) => (
          <Box key={exp.id}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" flexWrap="wrap">
              <Typography sx={{ fontSize: '11.5px', fontWeight: 700 }}>
                {exp.designation} · {exp.company}
              </Typography>
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                {formatMonthYear(exp.startDate)} – {exp.isCurrent ? 'Present' : formatMonthYear(exp.endDate)}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '10px', color: 'text.secondary', fontStyle: 'italic', mb: 0.25 }}>
              {exp.employmentType}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {exp.responsibilities.filter(Boolean).map((r, i) => (
                <Typography key={i} component="li" sx={{ fontSize: '10.5px', lineHeight: 1.5 }}>
                  {r}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function ProjectsSection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (resume.projects.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Projects</TemplateHeading>
      <Stack spacing={1}>
        {resume.projects.map((p) => (
          <Box key={p.id}>
            <Typography sx={{ fontSize: '11.5px', fontWeight: 700 }}>{p.name}</Typography>
            <Typography sx={{ fontSize: '10.5px', lineHeight: 1.5 }}>{p.description}</Typography>
            {p.technologies.length > 0 && (
              <Typography sx={{ fontSize: '10px', color: 'text.secondary' }}>
                {p.technologies.join(' · ')}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export function SkillsSection({
  resume,
  style,
  chipVariant = false,
  accentColor,
}: {
  resume: ResumeData;
  style: HeadingStyle;
  chipVariant?: boolean;
  accentColor?: string;
}) {
  if (resume.skills.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Skills</TemplateHeading>
      {chipVariant ? (
        <Stack direction="row" flexWrap="wrap" gap={0.6}>
          {resume.skills.map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              sx={{
                fontSize: '9.5px',
                height: 20,
                bgcolor: accentColor ? `${accentColor}22` : undefined,
                color: accentColor,
              }}
            />
          ))}
        </Stack>
      ) : (
        <Typography sx={{ fontSize: '10.5px' }}>{resume.skills.join('  ·  ')}</Typography>
      )}
    </Box>
  );
}

export function CertificatesSection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (resume.certificates.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Certificates</TemplateHeading>
      <Stack spacing={0.5}>
        {resume.certificates.map((c) => (
          <Typography key={c.id} sx={{ fontSize: '10.5px' }}>
            <strong>{c.name}</strong> — {c.issuer} {c.date && `(${c.date})`}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

export function AchievementsSection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (resume.achievements.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Achievements</TemplateHeading>
      <Box component="ul" sx={{ m: 0, pl: 2 }}>
        {resume.achievements.map((a) => (
          <Typography key={a.id} component="li" sx={{ fontSize: '10.5px', lineHeight: 1.5 }}>
            <strong>{a.title}</strong>
            {a.description ? ` — ${a.description}` : ''}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

export function LanguagesSection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (resume.languages.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Languages</TemplateHeading>
      <Typography sx={{ fontSize: '10.5px' }}>
        {resume.languages.map((l) => `${l.name} (${l.proficiency})`).join('  ·  ')}
      </Typography>
    </Box>
  );
}

export function InterestsSection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (resume.interests.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Interests</TemplateHeading>
      <Typography sx={{ fontSize: '10.5px' }}>{resume.interests.join('  ·  ')}</Typography>
    </Box>
  );
}

export function ReferencesSection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (resume.references.length === 0) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>References</TemplateHeading>
      <Stack spacing={0.5}>
        {resume.references.map((r) => (
          <Typography key={r.id} sx={{ fontSize: '10.5px' }}>
            <strong>{r.name}</strong> ({r.relation}) — {r.contact}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

export function SummarySection({ resume, style }: { resume: ResumeData; style: HeadingStyle }) {
  if (!resume.summary.trim()) return null;
  return (
    <Box sx={{ mb: 1.75 }}>
      <TemplateHeading style={style}>Summary</TemplateHeading>
      <Typography sx={{ fontSize: '10.5px', lineHeight: 1.6 }}>{resume.summary}</Typography>
    </Box>
  );
}

export const SECTION_RENDERERS: Record<
  ResumeSectionKey,
  (props: { resume: ResumeData; style: HeadingStyle }) => ReactElement | null
> = {
  summary: SummarySection,
  experience: ExperienceSection,
  education: EducationSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  certificates: CertificatesSection,
  achievements: AchievementsSection,
  languages: LanguagesSection,
  interests: InterestsSection,
  references: ReferencesSection,
};

export const A4_SX = {
  width: '210mm',
  minHeight: '297mm',
  bgcolor: '#fff',
  color: '#1a1a1a',
  boxShadow: '0 8px 40px -12px rgba(15,23,42,0.25)',
  mx: 'auto',
  overflow: 'hidden',
};
