'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Container from '../ui/Container'
import CtaButton from '../ui/CtaButton'
import SectionHeader from '../ui/SectionHeader'
import { ArrowRightIcon, QuoteIcon } from '../ui/Icons'
import { CTA, PROJECTS, TESTIMONIALS, type Project } from '../content'
import { LOGO_FILTER_INK } from '../tokens'
import { useFadeUp, useGrowBar } from './motion'
import {
  getOtherCases,
  type CaseMetric,
  type CaseResultBlock,
  type CaseStudy as Study,
} from '../data/cases'

/**
 * Corps de la fiche cas client `/realisations/[slug]` : en-tete, chiffres
 * cles, projet, livrables, processus, resultats (metriques, positions SEO,
 * galerie), temoignage et autres realisations.
 * Le cas est resolu par la page serveur, qui pose aussi les metadonnees, le
 * JSON-LD Article et la FAQ commune.
 */

/** Visuel et libelles du projet correspondant (content.ts). */
function findProject(slug: string): Project | undefined {
  return PROJECTS.find((item) => item.slug === slug)
}

/* -------------------------------------------------------------------------- */
/* Briques                                                                     */
/* -------------------------------------------------------------------------- */

function MetricCard({
  metric,
  delay,
  tone = 'light',
}: {
  metric: CaseMetric
  delay: number
  tone?: 'light' | 'dark'
}) {
  const fade = useFadeUp()
  const dark = tone === 'dark'
  /* Les valeurs longues (comparaison avant / apres) passent d'un cran. */
  const size = metric.value.length > 11 ? 'text-2xl' : 'text-4xl'

  return (
    <motion.div
      {...fade(delay)}
      className={`rounded-2xl p-6 ${dark ? 'bg-ink text-white' : 'text-ink bg-white'}`}
    >
      <p className={`-tracking-sm font-semibold ${size}`}>{metric.value}</p>
      <p className={`mt-2 text-sm ${dark ? 'text-white/70' : 'text-muted'}`}>
        {metric.label}
      </p>
      {metric.note ? (
        <p
          className={`mt-3 inline-block rounded-lg px-2 py-1 font-mono text-xs uppercase ${
            dark ? 'bg-white/10 text-white/80' : 'bg-primary/10 text-primary'
          }`}
        >
          {metric.note}
        </p>
      ) : null}
    </motion.div>
  )
}

function ProjectBlock({
  number,
  kicker,
  title,
  text,
  delay,
}: {
  number: string
  kicker: string
  title: string
  text: string
  delay: number
}) {
  const fade = useFadeUp()

  return (
    <motion.div
      {...fade(delay)}
      className="flex flex-col gap-3 rounded-3xl bg-white p-6 md:p-8"
    >
      <span className="text-primary font-mono text-sm">{number}</span>
      <span className="text-muted font-mono text-xs uppercase">{kicker}</span>
      <h3 className="-tracking-sm text-ink text-2xl font-medium text-balance">
        {title}
      </h3>
      <p className="text-muted leading-7">{text}</p>
    </motion.div>
  )
}

function RankingTable({
  ranking,
}: {
  ranking: NonNullable<Study['ranking']>
}) {
  const fade = useFadeUp()
  const grow = useGrowBar()

  return (
    <motion.div
      {...fade(0.05)}
      className="mt-6 rounded-3xl bg-white p-6 md:p-8"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-muted font-mono text-xs uppercase">
            {ranking.title}
          </p>
          <p className="text-ink mt-1 text-xl font-medium">{ranking.total}</p>
        </div>
        <span className="bg-primary/10 text-primary self-start rounded-lg px-3 py-1.5 text-sm font-medium sm:self-auto">
          {ranking.growth}
        </span>
      </div>

      <table className="mt-6 w-full border-collapse text-left">
        <thead>
          <tr className="text-muted font-mono text-xs uppercase">
            <th className="w-24 pb-3 font-normal">Position</th>
            <th className="pb-3 font-normal">Part des mots-clés</th>
            <th className="w-20 pb-3 text-right font-normal">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {ranking.rows.map((row, index) => (
            <tr key={row.label} className="border-ink/5 border-t">
              <td className="text-ink py-3 font-mono text-sm">{row.label}</td>
              <td className="py-3">
                <span className="flex items-center gap-3">
                  <span className="bg-ink/5 h-2 w-full min-w-16 overflow-hidden rounded-full">
                    <motion.span
                      {...grow(row.share, index * 0.08)}
                      className="bg-primary block h-full rounded-full"
                    />
                  </span>
                  <span className="text-ink w-12 shrink-0 text-sm font-medium">
                    {row.share}
                  </span>
                </span>
              </td>
              <td className="text-muted py-3 text-right text-sm">
                {row.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

function ResultBlock({
  block,
  index,
}: {
  block: CaseResultBlock
  index: number
}) {
  const fade = useFadeUp()

  return (
    <motion.article {...fade(0)} className="flex flex-col gap-4">
      <span className="text-primary font-mono text-xs uppercase">
        {block.kicker}
      </span>
      <h3 className="-tracking-sm text-ink text-2xl font-medium text-balance md:text-3xl">
        {block.title}
      </h3>
      <p className="text-muted max-w-3xl leading-7">{block.text}</p>

      {block.metrics.length > 0 ? (
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {block.metrics.map((metric, position) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              delay={position * 0.06}
              tone={index === 0 && position === 0 ? 'dark' : 'light'}
            />
          ))}
        </div>
      ) : null}

      {block.pages ? (
        <div className="mt-2">
          <p className="text-muted font-mono text-xs uppercase">
            Les pages du site
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {block.pages.map((page, position) => (
              <PageCard
                key={page.title}
                title={page.title}
                text={page.text}
                delay={position * 0.05}
              />
            ))}
          </div>
        </div>
      ) : null}
    </motion.article>
  )
}

function PageCard({
  title,
  text,
  delay,
}: {
  title: string
  text: string
  delay: number
}) {
  const fade = useFadeUp()

  return (
    <motion.div {...fade(delay)} className="rounded-2xl bg-white p-5">
      <h4 className="text-ink text-base font-medium">{title}</h4>
      <p className="text-muted mt-1 text-sm">{text}</p>
    </motion.div>
  )
}

function Gallery({ items }: { items: NonNullable<Study['gallery']> }) {
  const fade = useFadeUp()

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((image, index) => (
        <motion.figure
          key={image.src}
          {...fade(index * 0.06)}
          className="overflow-hidden rounded-2xl bg-white"
        >
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover"
          />
        </motion.figure>
      ))}
    </div>
  )
}

function Testimonial({ company }: { company: string }) {
  const fade = useFadeUp()
  const item = TESTIMONIALS.find((entry) => entry.company === company)
  if (!item) return null

  return (
    <section className="w-full py-16 md:py-24">
      <Container>
        <motion.figure
          {...fade(0)}
          className="bg-page border-ink/5 mx-auto flex max-w-3xl flex-col rounded-3xl border p-6 md:p-10"
        >
          <div className="flex items-start justify-between gap-4">
            <img
              src={item.logo}
              alt={item.company}
              loading="lazy"
              className="h-6 w-auto object-contain"
              style={{ filter: LOGO_FILTER_INK }}
            />
            <QuoteIcon size={22} className="text-ink/20 shrink-0" />
          </div>

          <blockquote className="text-ink mt-8 text-lg leading-7 text-pretty">
            {item.quote}
          </blockquote>

          <figcaption className="mt-8 flex items-center gap-3">
            <img
              src={item.avatar}
              alt=""
              aria-hidden="true"
              loading="lazy"
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0">
              <span className="text-ink block text-base font-medium">
                {item.name}
              </span>
              <span className="text-muted block text-sm">
                {item.role}, {item.company}
              </span>
            </span>
          </figcaption>
        </motion.figure>
      </Container>
    </section>
  )
}

function OtherCaseCard({ study, delay }: { study: Study; delay: number }) {
  const fade = useFadeUp()
  const project = findProject(study.projectSlug)

  return (
    <motion.div {...fade(delay)}>
      <Link
        href={`/realisations/${study.slug}`}
        className="group flex flex-col gap-4"
      >
        {project ? (
          <span className="block overflow-hidden rounded-2xl bg-white">
            <img
              src={project.image}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={
                project.imagePosition
                  ? { objectPosition: project.imagePosition }
                  : undefined
              }
            />
          </span>
        ) : null}
        <span className="text-muted font-mono text-xs uppercase">
          {study.client}
        </span>
        <span className="text-ink -tracking-sm flex items-center gap-2 text-xl font-medium">
          {project?.title ?? study.headline}
          <ArrowRightIcon
            size={18}
            className="text-primary transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </Link>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function CaseStudyView({ study }: { study: Study }) {
  const fade = useFadeUp()
  const project = findProject(study.projectSlug)
  const others = getOtherCases(study.slug, 3)

  return (
    <>
      {/* En-tete : fil, titre et meta a gauche, visuel a droite */}
      <section className="w-full py-8">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className="text-muted text-sm">
                <Link
                  href="/realisations"
                  className="hover:text-ink underline-offset-4 hover:underline"
                >
                  Réalisations
                </Link>
                <span className="px-2">/</span>
                {study.client}
              </p>

              <ul className="flex flex-wrap gap-2">
                {study.services.map((service) => (
                  <li
                    key={service}
                    className="bg-ink/5 text-ink rounded-lg px-3 py-1.5 text-sm"
                  >
                    {service}
                  </li>
                ))}
              </ul>

              <h1 className="-tracking-xl text-ink text-4xl leading-tight font-medium text-balance md:text-5xl">
                {study.headline}
              </h1>

              <p className="text-muted text-lg">{study.intro}</p>

              <dl className="border-ink/5 mt-2 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-3">
                {[
                  { label: 'Client', value: study.client },
                  { label: 'Secteur', value: study.sector },
                  { label: 'Durée', value: study.duration },
                ].map((meta) => (
                  <div key={meta.label} className="flex flex-col gap-1">
                    <dt className="text-muted font-mono text-xs uppercase">
                      {meta.label}
                    </dt>
                    <dd className="text-ink font-medium">{meta.value}</dd>
                  </div>
                ))}
              </dl>

              <CtaButton
                label={CTA.label}
                href={CTA.href}
                className="mt-4 self-start"
              />
            </div>

            {project ? (
              <div className="overflow-hidden rounded-3xl bg-white">
                <img
                  src={project.image}
                  alt={`${study.client} : ${project.title}`}
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover"
                  style={
                    project.imagePosition
                      ? { objectPosition: project.imagePosition }
                      : undefined
                  }
                />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* Chiffres cles */}
      <section className="w-full py-8">
        <Container>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {study.metrics.map((metric, index) => (
              <MetricCard
                key={metric.label}
                metric={metric}
                delay={index * 0.08}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Le projet : contexte et solution */}
      <section className="w-full py-16 md:py-24">
        <Container>
          <SectionHeader title="Le projet" />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <ProjectBlock
              number={study.context.number}
              kicker="Le contexte"
              title={study.context.title}
              text={study.context.text}
              delay={0}
            />
            <ProjectBlock
              number={study.solution.number}
              kicker="Notre solution"
              title={study.solution.title}
              text={study.solution.text}
              delay={0.1}
            />
          </div>
        </Container>
      </section>

      {/* Livrables */}
      <section className="w-full pb-16 md:pb-24">
        <Container>
          <SectionHeader title="Ce qu'on a livré" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {study.deliverables.map((item, index) => (
              <ProjectBlock
                key={item.title}
                number={item.number}
                kicker="Livrable"
                title={item.title}
                text={item.text}
                delay={index * 0.08}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Processus */}
      <section className="bg-ink w-full py-16 text-white md:py-24">
        <Container>
          <p className="font-mono text-xs uppercase text-white/60">
            Notre processus
          </p>
          <h2 className="-tracking-xl mt-4 text-3xl font-medium text-balance md:text-4xl">
            {study.processTitle}
          </h2>

          <ol className="mt-12 grid gap-8 md:grid-cols-5 md:gap-4">
            {study.steps.map((step, index) => (
              <motion.li
                key={step.title}
                {...fade(index * 0.08)}
                className="flex flex-col gap-3"
              >
                <span className="flex items-center gap-3">
                  <span className="text-primary flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 font-mono text-xs">
                    {`0${index + 1}`}
                  </span>
                  {index < study.steps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="hidden h-px w-full bg-white/15 md:block"
                    />
                  ) : null}
                </span>
                <span className="text-lg font-medium">{step.title}</span>
                <span className="text-sm leading-6 text-white/70">
                  {step.text}
                </span>
              </motion.li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Resultats */}
      <section className="w-full py-16 md:py-24">
        <Container>
          <SectionHeader title={study.resultsTitle} />

          <div className="mt-10 flex flex-col gap-14">
            {study.results.map((block, index) => (
              <ResultBlock key={block.title} block={block} index={index} />
            ))}
          </div>

          {study.ranking ? <RankingTable ranking={study.ranking} /> : null}

          {study.externalUrl ? (
            <div className="mt-10">
              <CtaButton
                label={study.externalUrl.label}
                href={study.externalUrl.href}
                tone="light"
              />
            </div>
          ) : null}

          {study.gallery ? <Gallery items={study.gallery} /> : null}
        </Container>
      </section>

      {/* Temoignage client */}
      {study.testimonialCompany ? (
        <Testimonial company={study.testimonialCompany} />
      ) : null}

      {/* Autres realisations */}
      {others.length > 0 ? (
        <section className="w-full pb-16 md:pb-24">
          <Container>
            <SectionHeader
              title="Autres réalisations"
              right={
                <CtaButton
                  label="Voir toutes les réalisations"
                  href="/realisations"
                  tone="light"
                />
              }
            />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {others.map((item, index) => (
                <OtherCaseCard
                  key={item.slug}
                  study={item}
                  delay={index * 0.08}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
