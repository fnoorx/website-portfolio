/*
 * Command button in the XP control language.
 *
 * Owns the two things every call site was repeating by hand: the `type="button"`
 * default and the presentational arrow glyph on default actions. Links reuse the
 * same faces by applying the `.xp-button` classes directly.
 */
export default function XpButton({ variant = 'primary', compact = false, icon, className = '', children, ...props }) {
	const classes = [
		'xp-button',
		`xp-button--${variant}`,
		compact ? 'xp-button--compact' : '',
		className,
	].filter(Boolean).join(' ');

	return (
		<button className={classes} type="button" {...props}>
			{icon ?? (variant === 'primary' ? <span className="xp-button__arrow" aria-hidden="true" /> : null)}
			{children}
		</button>
	);
}
