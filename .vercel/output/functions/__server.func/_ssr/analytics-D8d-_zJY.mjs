import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader, t as EmptyState } from "./Section-DzQNS7-J.mjs";
import { p as useSession } from "./router-WzjKqw9S.mjs";
import { F as Eye, M as Headphones, b as Play, i as Users, q as BookOpen, s as UserPlus, u as TrendingUp, w as MousePointer } from "../_libs/lucide-react.mjs";
import { o as useAdminAnalytics } from "./use-admin-data-Ci0dyhh6.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as XAxis, c as Pie, d as Tooltip, i as YAxis, l as Cell, n as BarChart, o as Line, r as LineChart, s as Bar, t as PieChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-D8d-_zJY.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#7C3AED",
	"#F4C95D",
	"#10B981",
	"#3B82F6",
	"#EF4444",
	"#F59E0B"
];
function AdminAnalyticsPage() {
	const { isAdmin, loading } = useSession();
	const { data, isLoading: loadingData, isError: loadingError } = useAdminAnalytics();
	const stats = data?.stats ?? {
		totalViews: 0,
		totalReads: 0,
		totalFollows: 0,
		totalSignups: 0,
		totalChapterReads: 0,
		totalAudioPlays: 0,
		totalVideoPlays: 0,
		totalSearches: 0,
		totalShares: 0,
		totalVisitors: 0,
		totalStoryViews: 0,
		totalChapterStarts: 0
	};
	const dailyVisitors = data?.dailyVisitors ?? [];
	const topStories = data?.topStories ?? [];
	const recentEvents = data?.recentEvents ?? [];
	const eventBreakdown = data?.eventBreakdown ?? [];
	const funnelCounts = data?.funnelCounts ?? {
		started: 0,
		reached25: 0,
		reached50: 0,
		reached75: 0,
		completed: 0
	};
	const attributionData = data?.attributionData ?? [];
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 text-sm text-muted-foreground sm:px-6",
		children: "Loading…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Admins only",
			body: "This area is restricted to Taleon administrators.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/account",
				className: "rounded-md border border-border px-5 py-2.5 text-sm",
				children: "Back to my library"
			})
		})
	});
	if (loadingError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-4 py-24 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Unable to load analytics",
			body: "The analytics service could not be reached. Try refreshing, or check your Supabase connection and Realtime publication settings.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => window.location.reload(),
				className: "rounded-md border border-border px-5 py-2.5 text-sm",
				children: "Try again"
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Admin",
		title: "Analytics",
		lede: "Track engagement, conversions, and content performance."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto w-full max-w-7xl space-y-8 px-4 pb-20 sm:px-6",
		children: loadingData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-12 text-muted-foreground",
			children: "Loading analytics..."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: [
					{
						label: "Visitors",
						value: stats.totalVisitors,
						icon: Users,
						color: "text-blue-400"
					},
					{
						label: "Story Views",
						value: stats.totalStoryViews,
						icon: Eye,
						color: "text-indigo-400"
					},
					{
						label: "Chapter Starts",
						value: stats.totalChapterStarts,
						icon: BookOpen,
						color: "text-green-400"
					},
					{
						label: "Chapter Completes",
						value: stats.totalChapterReads,
						icon: BookOpen,
						color: "text-emerald-400"
					},
					{
						label: "Follows",
						value: stats.totalFollows,
						icon: UserPlus,
						color: "text-purple-400"
					},
					{
						label: "Signups",
						value: stats.totalSignups,
						icon: Users,
						color: "text-yellow-400"
					},
					{
						label: "Audio Plays",
						value: stats.totalAudioPlays,
						icon: Headphones,
						color: "text-pink-400"
					},
					{
						label: "Video Plays",
						value: stats.totalVideoPlays,
						icon: Play,
						color: "text-red-400"
					},
					{
						label: "Searches",
						value: stats.totalSearches,
						icon: MousePointer,
						color: "text-cyan-400"
					},
					{
						label: "Shares",
						value: stats.totalShares,
						icon: TrendingUp,
						color: "text-orange-400"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface-2 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: s.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: `h-4 w-4 ${s.color}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl",
						children: s.value.toLocaleString()
					})]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface-2 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 text-lg font-medium",
						children: "Daily Events (14 days)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 250,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: dailyVisitors,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "date",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "visitors",
									stroke: "#7C3AED",
									strokeWidth: 2,
									dot: false
								})
							]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface-2 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 text-lg font-medium",
						children: "Event Breakdown"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 250,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: eventBreakdown,
							cx: "50%",
							cy: "50%",
							innerRadius: 60,
							outerRadius: 90,
							paddingAngle: 3,
							dataKey: "value",
							label: ({ name, percent }) => `${name} ${(percent != null ? percent * 100 : 0).toFixed(0)}%`,
							children: eventBreakdown.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface-2 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mb-4 text-lg font-medium",
						children: "Chapter Completion Funnel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-6 sm:grid-cols-5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-display text-gold",
								children: funnelCounts.started.toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Started"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-display text-gold",
								children: funnelCounts.reached25.toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "25% Read"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-display text-gold",
								children: funnelCounts.reached50.toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "50% Read"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-display text-gold",
								children: funnelCounts.reached75.toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "75% Read"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl font-display text-gold",
								children: funnelCounts.completed.toLocaleString()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Completed"
							})] })
						]
					}),
					funnelCounts.started > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-2 rounded-full bg-surface overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-gold transition-all",
							style: { width: `${Math.round(funnelCounts.completed / funnelCounts.started * 100)}%` }
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface-2 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-lg font-medium",
					children: "Acquisition by Source"
				}), attributionData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No acquisition data yet"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2",
								children: "Source"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2",
								children: "Visitors"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2",
								children: "Chapter Starts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2",
								children: "Completions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2",
								children: "Completion Rate"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: attributionData.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2",
								children: a.source
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-muted-foreground",
								children: a.visits.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-muted-foreground",
								children: a.starts.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-muted-foreground",
								children: a.completions.toLocaleString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2",
								children: a.visits > 0 ? `${Math.round(a.completions / a.visits * 100)}%` : "—"
							})
						] }, a.source))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface-2 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-lg font-medium",
					children: "Top Stories by Engagement"
				}), topStories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No story data yet"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 300,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: topStories,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "title",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "starts",
								fill: "#7C3AED",
								name: "Chapter Starts"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "reads",
								fill: "#F4C95D",
								name: "Completed"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface-2 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-lg font-medium",
					children: "Story Performance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs text-muted-foreground uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3",
									children: "Story"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3",
									children: "Views"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3",
									children: "Starts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3",
									children: "Completions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-3",
									children: "Completion Rate"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: topStories.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/story/$slug",
										params: { slug: s.slug },
										className: "hover:text-gold",
										children: s.title || "Unknown"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-muted-foreground",
									children: s.views
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-muted-foreground",
									children: s.starts
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-muted-foreground",
									children: s.reads
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: s.completionRate > 50 ? "text-green-400" : s.completionRate > 20 ? "text-yellow-400" : "text-red-400",
										children: [s.completionRate, "%"]
									})
								})
							] }, i))
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-surface-2 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-lg font-medium",
					children: "Recent Events"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-96 space-y-2 overflow-y-auto",
					children: recentEvents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No events tracked yet"
					}) : recentEvents.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border py-2 text-sm last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: e.event_name.includes("view") ? "default" : e.event_name.includes("complete") || e.event_name.includes("reads") ? "secondary" : e.event_name.includes("follow") ? "outline" : "default",
							children: e.event_name.replace(/_/g, " ")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: new Date(e.created_at).toLocaleString()
						})]
					}, e.id))
				})]
			})
		] })
	})] });
}
//#endregion
export { AdminAnalyticsPage as component };
