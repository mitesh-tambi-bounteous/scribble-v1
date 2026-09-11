def lin(c):
    c /= 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def lum(h):
    h = h.lstrip('#')
    r, g, b = [int(h[i:i + 2], 16) for i in (0, 2, 4)]
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(h1, h2):
    l1, l2 = lum(h1), lum(h2)
    l1, l2 = max(l1, l2), min(l1, l2)
    return (l1 + 0.05) / (l2 + 0.05)


print('fg/bg', contrast('18181b', 'ffffff'))
print('on-primary/primary', contrast('ffffff', '2563eb'))
print('fg-muted/bg', contrast('71717a', 'ffffff'))
