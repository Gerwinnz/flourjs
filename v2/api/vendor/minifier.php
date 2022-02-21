<?php

// Based on <https://github.com/mecha-cms/x.minify>

namespace x\minify\_ { // start namespace

$n = __NAMESPACE__;

\define($n . "\\token_boolean", '\b(?:true|false)\b');
\define($n . "\\token_number", '-?(?:(?:\d+)?\.)?\d+');
\define($n . "\\token_string", '(?:"(?:[^"\\\]|\\\.)*"|\'(?:[^\'\\\]|\\\.)*\')');

\define($n . "\\token_css_spec", '(?:[^\0-\237]|\\[a-f\d]{1,6}(?:\n\r|[ \f\n\r\t])?|\\[^a-f\d\f\n\r])');

\define($n . "\\token_css_combinator", '[~+>]');
\define($n . "\\token_css_comment", '/\*[^*]*\*+(?:[^/*][^*]*\*+)*/');
\define($n . "\\token_css_hack", '[!#$%&()*+,./:<=>?@\[\]_`|~]');
\define($n . "\\token_css_hex", '#(?:[a-f\d]{1,2}){3,4}');
\define($n . "\\token_css_property", '[a-z-][a-z\d-]*');
\define($n . "\\token_css_value", '(?:' . token_string . '|[^;])*');

// <https://drafts.csswg.org/css2#tokenization>
\define($n . "\\token_css_name", '(?:_[a-z]|' . token_css_spec . ')(?:[_a-z\d-]|' . token_css_spec . ')*');
\define($n . "\\token_css_function", token_css_property . '\(\s*(?:' . token_string . '|[^};])*\s*\)');

\define($n . "\\token_css_selector_any", '[&*]');
\define($n . "\\token_css_selector_at", '@' . token_css_name);
\define($n . "\\token_css_selector_attr", '\[(?:' . token_string . '|[^]])*\]');
\define($n . "\\token_css_selector_class", '\.' . token_css_name);
\define($n . "\\token_css_selector_element", token_css_name);
\define($n . "\\token_css_selector_function", '::?' . token_css_function);
\define($n . "\\token_css_selector_id", '#' . token_css_name);
\define($n . "\\token_css_selector_pseudo", '::?' . token_css_property);

\define($n . "\\token_css_function_url", 'url\(\s*(?:' . token_string . '|[^()]+)\s*\)');

\define($n . "\\tokens_css_color_name", [
    'aliceblue' => '#f0f8ff',
    'antiquewhite' => '#faebd7',
    'aqua' => '#0ff',
    'aquamarine' => '#7fffd4',
    'azure' => '#f0ffff',
    'beige' => '#f5f5dc',
    'bisque' => '#ffe4c4',
    'black' => '#000',
    'blanchedalmond' => '#ffebcd',
    'blue' => '#00f',
    'blueviolet' => '#8a2be2',
    'brown' => '#a52a2a',
    'burlywood' => '#deb887',
    'cadetblue' => '#5f9ea0',
    'chartreuse' => '#7fff00',
    'chocolate' => '#d2691e',
    'coral' => '#ff7f50',
    'cornflowerblue' => '#6495ed',
    'cornsilk' => '#fff8dc',
    'crimson' => '#dc143c',
    'cyan' => '#0ff',
    'darkblue' => '#00008b',
    'darkcyan' => '#008b8b',
    'darkgoldenrod' => '#b8860b',
    'darkgray' => '#a9a9a9',
    'darkgreen' => '#006400',
    'darkgrey' => '#a9a9a9',
    'darkkhaki' => '#bdb76b',
    'darkmagenta' => '#8b008b',
    'darkolivegreen' => '#556b2f',
    'darkorange' => '#ff8c00',
    'darkorchid' => '#9932cc',
    'darkred' => '#8b0000',
    'darksalmon' => '#e9967a',
    'darkseagreen' => '#8fbc8f',
    'darkslateblue' => '#483d8b',
    'darkslategray' => '#2f4f4f',
    'darkslategrey' => '#2f4f4f',
    'darkturquoise' => '#00ced1',
    'darkviolet' => '#9400d3',
    'deeppink' => '#ff1493',
    'deepskyblue' => '#00bfff',
    'dimgray' => '#696969',
    'dimgrey' => '#696969',
    'dodgerblue' => '#1e90ff',
    'firebrick' => '#b22222',
    'floralwhite' => '#fffaf0',
    'forestgreen' => '#228b22',
    'fuchsia' => '#f0f',
    'gainsboro' => '#dcdcdc',
    'ghostwhite' => '#f8f8ff',
    'gold' => '#ffd700',
    'goldenrod' => '#daa520',
    'gray' => '#808080',
    'green' => '#008000',
    'greenyellow' => '#adff2f',
    'grey' => '#808080',
    'honeydew' => '#f0fff0',
    'hotpink' => '#ff69b4',
    'indianred' => '#cd5c5c',
    'indigo' => '#4b0082',
    'ivory' => '#fffff0',
    'khaki' => '#f0e68c',
    'lavender' => '#e6e6fa',
    'lavenderblush' => '#fff0f5',
    'lawngreen' => '#7cfc00',
    'lemonchiffon' => '#fffacd',
    'lightblue' => '#add8e6',
    'lightcoral' => '#f08080',
    'lightcyan' => '#e0ffff',
    'lightgoldenrodyellow' => '#fafad2',
    'lightgray' => '#d3d3d3',
    'lightgreen' => '#90ee90',
    'lightgrey' => '#d3d3d3',
    'lightpink' => '#ffb6c1',
    'lightsalmon' => '#ffa07a',
    'lightseagreen' => '#20b2aa',
    'lightskyblue' => '#87cefa',
    'lightslategray' => '#789',
    'lightslategrey' => '#789',
    'lightsteelblue' => '#b0c4de',
    'lightyellow' => '#ffffe0',
    'lime' => '#0f0',
    'limegreen' => '#32cd32',
    'linen' => '#faf0e6',
    'magenta' => '#f0f',
    'maroon' => '#800000',
    'mediumaquamarine' => '#66cdaa',
    'mediumblue' => '#0000cd',
    'mediumorchid' => '#ba55d3',
    'mediumpurple' => '#9370db',
    'mediumseagreen' => '#3cb371',
    'mediumslateblue' => '#7b68ee',
    'mediumspringgreen' => '#00fa9a',
    'mediumturquoise' => '#48d1cc',
    'mediumvioletred' => '#c71585',
    'midnightblue' => '#191970',
    'mintcream' => '#f5fffa',
    'mistyrose' => '#ffe4e1',
    'moccasin' => '#ffe4b5',
    'navajowhite' => '#ffdead',
    'navy' => '#000080',
    'oldlace' => '#fdf5e6',
    'olive' => '#808000',
    'olivedrab' => '#6b8e23',
    'orange' => '#ffa500',
    'orangered' => '#ff4500',
    'orchid' => '#da70d6',
    'palegoldenrod' => '#eee8aa',
    'palegreen' => '#98fb98',
    'paleturquoise' => '#afeeee',
    'palevioletred' => '#db7093',
    'papayawhip' => '#ffefd5',
    'peachpuff' => '#ffdab9',
    'peru' => '#cd853f',
    'pink' => '#ffc0cb',
    'plum' => '#dda0dd',
    'powderblue' => '#b0e0e6',
    'purple' => '#800080',
    'rebeccapurple' => '#639',
    'red' => '#f00',
    'rosybrown' => '#bc8f8f',
    'royalblue' => '#4169e1',
    'saddlebrown' => '#8b4513',
    'salmon' => '#fa8072',
    'sandybrown' => '#f4a460',
    'seagreen' => '#2e8b57',
    'seashell' => '#fff5ee',
    'sienna' => '#a0522d',
    'silver' => '#c0c0c0',
    'skyblue' => '#87ceeb',
    'slateblue' => '#6a5acd',
    'slategray' => '#708090',
    'slategrey' => '#708090',
    'snow' => '#fffafa',
    'springgreen' => '#00ff7f',
    'steelblue' => '#4682b4',
    'tan' => '#d2b48c',
    'teal' => '#008080',
    'thistle' => '#d8bfd8',
    'tomato' => '#ff6347',
    'turquoise' => '#40e0d0',
    'violet' => '#ee82ee',
    'wheat' => '#f5deb3',
    'white' => '#fff',
    'whitesmoke' => '#f5f5f5',
    'yellow' => '#ff0',
    'yellowgreen' => '#9acd32'
]);

\define($n . "\\tokens_css_color_hex", \array_flip(tokens_css_color_name));

// <https://drafts.csswg.org/css2#block>
\define($n . "\\token_css_block", '\{(?:' . token_string . '|[^{}]|(?R))*\}');

// <https://drafts.csswg.org/css2#rule-sets>
\define($n . "\\token_css_rules", '(?:\s*(?:' . \implode('|', [
    token_css_comment,
    token_css_selector_function,
    token_css_selector_pseudo,
    token_css_selector_attr,
    token_css_selector_any,
    token_css_selector_at,
    token_css_selector_class,
    token_css_selector_id,
    token_css_selector_element,
    token_css_combinator,
    '[^{};]'
]) . ')\s*)+\s*' . token_css_block);

// <https://www.w3.org/TR/css-values-4>
\define($n . "\\token_css_unit", '%|Hz|Q|cap|ch|cm|deg|dpcm|dpi|dppx|em|ex|grad|ic|in|kHz|lh|mm|ms|pc|pt|px|rad|rcap|rch|rem|rex|ric|rlh|s|turn|vb|vh|vi|vmax|vmin|vw');
\define($n . "\\token_css_number", token_number . '(?:' . token_css_unit . ')');

\define($n . "\\token_html_name", '[a-z\d][a-z\d:-]*');

\define($n . "\\token_html_comment", '<!--[\s\S]*?-->');
\define($n . "\\token_html_dtd", '<!' . token_html_name . '(?:\s(?:' . token_string . '|[^>])*)?>');
\define($n . "\\token_html_element_end", '</' . token_html_name . '>');
\define($n . "\\token_html_element_start", '<' . token_html_name . '(?:\s(?:' . token_string . '|[^>])*)?>');
\define($n . "\\token_html_pi", '<\?' . token_html_name . '(?:\s(?:' . token_string . '|[^>])*)?\?>');

// Don’t touch HTML content of `<pre>`, `<code>`, `<script>`, `<style>`, `<textarea>` element
\define($n . "\\token_html_element_skip", (static function($tags) {
    foreach ($tags as &$tag) {
        $tag = '<' . $tag . '(?:\s(?:' . token_string . '|[^>])*)?>[\s\S]*?</' . $tag . '>';
    }
    unset($tag);
    return '(?:' . \implode('|', $tags) . ')';
})(['pre', 'code', 'script', 'style', 'textarea']));

\define($n . "\\token_html_entity", '&(?:[a-z\d]+|#\d+|#x[a-f\d]+);');

\define($n . "\\token_js_comment", token_css_comment);
\define($n . "\\token_js_comment_2", '//[^\n]*');
\define($n . "\\token_js_name", '[a-z$_][a-z$_\d]*');
\define($n . "\\token_js_pattern", '/(?:(?![*+?])(?:[^\n\[/\\\]|\\\.|\[(?:[^\n\]\\\]|\\\.)*\])+)/[gimuy]*');
\define($n . "\\token_js_string", '`(?:[^`\\\]|\\\.)*`');

function every(array $tokens, callable $fn = null, string $in = null, string $flag = 'i') {
    if ("" === ($in = \trim($in))) {
        return "";
    }
    $pattern = \strtr('(?:' . \implode(')|(?:', $tokens) . ')', ['/' => "\\/"]);
    $chops = \preg_split('/(' . $pattern . ')/' . $flag, $in, null, \PREG_SPLIT_DELIM_CAPTURE | \PREG_SPLIT_NO_EMPTY);
    if (!$fn) {
        return $chops;
    }
    $out = "";
    while ($chops) {
        $chop = \array_shift($chops);
        if ("" === ($token = \trim($chop))) {
            continue;
        }
        $out .= $fn($token, $chop);
    }
    return $out;
}

function get_css_rules($token) {
    $block = $selector = "";
    $m = \preg_split('/(' . token_string . '|[{])/', $token, null, \PREG_SPLIT_DELIM_CAPTURE | \PREG_SPLIT_NO_EMPTY);
    while ($m) {
        if ('{' === ($v = \array_shift($m))) {
            break;
        }
        $selector .= $v;
    }
    $selector = \trim($selector);
    $block = \trim(\substr(\implode("", $m), 0, -1), ' ;');
    return [$selector, $block];
}

function get_css_function($token) {
    if (is_token_css_function($token)) {
        return \explode('(', \substr($token, 0, -1), 2);
    }
    return [];
}

function get_html_name($token) {
    if (is_token_element($token)) {
        $m = \preg_split('/\s+/', \trim(\trim($token, '<>')), 2);
        return [$m[0], $m[1] ?? ""];
    }
    return [];
}

function is_token_boolean($token) {
    return 'false' === $token || 'true' === $token;
}

function is_token_element($token) {
    return $token && '<' === $token[0] && '>' === \substr($token, -1);
}

function is_token_number($token) {
    return \is_numeric($token);
}

function is_token_string($token) {
    if ("" === $token) {
        return false;
    }
    return ('"' === $token[0] && '"' === \substr($token, -1) || "'" === $token[0] && "'" === \substr($token, -1));
}

function is_token_css_comment($token) {
    return '/*' === \substr($token, 0, 2) && '*/' === \substr($token, -2);
}

function is_token_css_function($token) {
    return ')' === \substr($token, -1) && \strpos($token, '(') > 0;
}

function is_token_css_hex($token) {
    return '#' === $token[0];
}

function is_token_css_unit($token) {
    return (
        // `1`
        \is_numeric($token) || (
            // `1px`
            (
                '-' === $token[0] || '.' === $token[0] || \is_numeric($token[0])
            ) && \preg_match('/^' . token_css_number . '$/', $token)
        )
    );
}

function is_token_html_comment($token) {
    return '<!--' === \substr($token, 0, 4) && '-->' === \substr($token, -3);
}

function is_token_html_entity($token) {
    return '&' === $token[0] && ';' === \substr($token, -1);
}

function is_token_js_comment($token) {
    return 0 === \strpos($token, '//') || '/*' === \substr($token, 0, 2) && '*/' === \substr($token, -2);
}

function is_token_js_pattern($token) {
    return '/' === $token[0] && '/' === \substr($token, -1);
}

function is_token_js_string($token) {
    return is_token_string($token) || '`' === $token[0] && '`' === \substr($token, -1);
}

function minify_number($token) {
    if ('-' === $token[0] && \strlen($token) > 1) {
        $number = minify_number(\substr($token, 1));
        return '0' === $number ? '0' : '-' . $number;
    }
    if (\is_numeric($token)) {
        if (false !== \strpos($token, '.')) {
            // Convert `5.0` to `5.`
            // Convert `5.10` to `5.1`
            $token = \rtrim($token, '0');
            // Convert `5.` to `5`
            $token = \rtrim($token, '.');
        }
        // Convert `0.5` to `.5`
        return ('0.' === \substr($token, 0, 2) ? \substr($token, 1) : $token);
    }
    return $token;
}

function minify_number_long($token) {
    // TODO: Convert `1000` to `1e3`
    // if ('0' === $token) {
    //     return $token;
    // }
    // $x = '-' === $token[0] ? '-' : "";
    // <https://stackoverflow.com/a/21417604/1163000>
    // $token = (float) ($x ? \substr($token, 1) : $token);
    // $exp = \floor(\log($token, 10));
    // return $x . \sprintf('%.2fE%+03d', $token / \pow(10, $exp), $exp);
    return $token;
}

function minify_css_color($token) {
    if (is_token_css_hex($token)) {
        $token = \strtolower(\preg_replace('/^#([a-f\d])\1([a-f\d])\2([a-f\d])\3(?:([a-f\d])\4)?$/i', '#$1$2$3$4', $token));
        // Remove solid alpha channel from HEX color
        if (9 === \strlen($token)) {
            if ('ff' === \substr($token, -2)) {
                $token = \substr($token, 0, -2);
            } else if ('00' === \substr($token, -2)) {
                $token = 'transparent';
            }
        } else if (5 === \strlen($token)) {
            if ('f' === \substr($token, -1)) {
                $token = \substr($token, 0, -1);
            } else if ('0' === \substr($token, -1)) {
                $token = 'transparent';
            }
        }
        $v = tokens_css_color_hex[$token] ?? $token;
        return $v !== $token && \strlen($v) < \strlen($token) ? $v : $token;
    }
    $token = \preg_replace('/\s*([(),\/])\s*/', '$1', $token);
    if (is_token_css_function($token)) {
        if (0 === \strpos($token, 'rgba(')) {
            // Remove solid alpha channel from RGB color
            if (',1)' === \substr($token, -3) || '/1)' === \substr($token, -3)) {
                // Solid alpha channel, convert it to RGB
                $hex = minify_css_color($rgb = 'rgb(' . \substr($token, 5, -3) . ')');
                return \strlen($hex) < \strlen($rgb) ? $hex : $rgb;
            }
            if (\preg_match('/^rgba\((\d+)[, ](\d+)[, ](\d+)[,\/](' . token_number . ')\)$/', $token, $m)) {
                $hex = minify_css_color(\sprintf("#%02x%02x%02x%02x", $m[1], $m[2], $m[3], ((float) $m[4]) * 255));
                return \strlen($hex) < \strlen($token) ? $hex : $token;
            }
        }
        if (0 === \strpos($token, 'rgb(')) {
            if (\preg_match('/^rgb\((\d+)[, ](\d+)[, ](\d+)\)$/', $token, $m)) {
                $hex = minify_css_color(\sprintf("#%02x%02x%02x", $m[1], $m[2], $m[3]));
                return \strlen($hex) < \strlen($token) ? $hex : $token;
            }
        }
        // Assume that any number in other color function(s) can be minified anyway
    }
    $v = tokens_css_color_name[$token] ?? $token;
    return $v !== $token && \strlen($v) < \strlen($token) ? $v : $token;
}

function minify_css_function($token, int $quote = 2) {
    if (!$m = get_css_function($token)) {
        return $token;
    }
    $name = $m[0];
    $params = $m[1];
    $raw = "";
    // Prepare to remove quote(s) from string-only argument in function
    if ($params && is_token_string($params)) {
        $raw = \substr($params, 1, -1);
    }
    if ('calc' === $name) {
        // Only minify the number, do not remove the unit for now. I have no idea how
        // this `calc()` thing works in handling the unit(s). As far as I know, the only
        // valid unit-less number is when they are used as the divisor/multiplicator.
        // We can remove the space between `(` and `)` safely.
        $params = \trim(\preg_replace_callback('/' . token_number . '/', static function($m) {
            return minify_number($m[0]);
        }, $params));
        return 'calc(' . \strtr($params, [
            '( ' => '(',
            ' )' => ')'
        ]) . ')';
    }
    if ('format' === $name && "" !== $raw) {
        // Cannot remove quote(s) from `format()` safely :(
        return "format('" . $raw . "')";
    }
    if ('url' === $name && "" !== $raw) {
        // <https://datatracker.ietf.org/doc/html/rfc3986#section-2.2>
        // <https://datatracker.ietf.org/doc/html/rfc3986#section-2.3>
        if (1 !== $quote && false === \strpos($raw, ' ') && \preg_match('/^[!#$&\'()*+,\-.\/:;=?@\[\]~\w]+$/', $raw)) {
            return 'url(' . $raw . ')';
        }
        return "url('" . $raw . "')";
    }
    // <https://www.w3.org/TR/css-color-4>
    if (false !== \strpos(',color,device-cmyk,hsl,hsla,hwb,lab,lch,rgb,rgba,', ',' . $name . ',')) {
        return minify_css_color($token);
    }
    return $name . '(' . $params . ')';
}

function minify_css_unit($token) {
    $number = $token;
    $unit = "";
    if (!\is_numeric($token) && \preg_match('/^(' . token_number . ')(' . token_css_unit . ')$/i', $token, $m)) {
        $number = $m[1];
        $unit = $m[2];
    }
    $number = minify_number($number);
    if ('0' === $number) {
        // `0%` or `0deg`
        if ('%' === $unit || 'deg' === $unit) {
            return $number . $unit;
        }
        return $number;
    }
    return $number . $unit;
}

function minify_css_values($token, int $quote = 2) {
    $token = every([
        token_css_comment,
        token_css_hex,
        token_css_function_url,
        token_css_function,
        token_string,
        token_css_property,
        token_css_number,
        token_number,
        '[;,]'
    ], static function($token) use($quote) {
        if (is_token_css_comment($token)) {
            return $token;
        }
        if ('""' === $token || "''" === $token) {
            return '""';
        }
        if (is_token_string($token)) {
            $raw = \substr($token, 1, -1);
            return false !== \strpos($raw, "'") ? '"' . $raw . '"' : "'" . $raw . "'";
        }
        if (is_token_css_hex($token) || isset(tokens_css_color_name[$token])) {
            $token = minify_css_color($token);
        } else if (is_token_css_function($token)) {
            $token = minify_css_function($token, $quote);
        } else if (is_token_css_unit($token)) {
            $token = minify_css_unit($token);
        }
        return ' ' . $token . ' '; // Ensure white-space around token!
    }, $token);
    $token = 'x' . $token . 'x';
    $token = every([
        token_css_comment,
        '\s*' . token_css_function_url . '\s*',
        '\s*' . token_css_function . '\s*',
        '\s*' . token_string . '\s*',
        '[;,/]'
    ], function($token, $chop) {
        if (is_token_css_comment($token) || is_token_string($token) || is_token_css_function($token)) {
            return $chop;
        }
        return $token;
    }, $token);
    return \substr($token, 1, -1);
}

function minify_css(string $in, int $comment = 2, int $quote = 2) {
    if ("" === ($in = \trim($in))) {
        return "";
    }
    $out = every([token_css_comment], static function($token) use($comment) {
        if (1 === $comment) {
            return $token;
        }
        if (is_token_css_comment($token)) {
            if (2 === $comment) {
                if (
                    // Detect special comment(s) from the third character.
                    // Should be an `!` or `*` → `/*! asdf */` or `/** asdf */`
                    isset($token[2]) && false !== \strpos('!*', $token[2]) ||
                    // Detect license comment(s) from the content phrase.
                    // It should contains character(s) like `@license`
                    false !== \strpos($token, '@licence') || // noun
                    false !== \strpos($token, '@license') || // verb
                    false !== \strpos($token, '@preserve')
                ) {
                    $token = \ltrim(\substr($token, 2, -2), '!*');
                    return '/*' . \trim(\strtr($token, ['@preserve' => ""])) . '*/';
                }
            }
            return ""; // Remove!
        }
        return $token;
    }, $in);
    $out = every([
        token_css_rules,
        token_css_comment,
        '@charset\s+' . token_string . '\s*;',
        '@import\s+' . token_string . '[^;]*;',
        '@import\s+' . token_css_function_url . '[^;]*;',
    ], static function($token) use($comment, $quote) {
        if (is_token_css_comment($token)) {
            return $token; // Keep!
        }
        // Normalize white-space(s) to a space
        $token = \preg_replace('/\s+/', ' ', $token);
        // Remove empty selector and rule(s)
        if ('{}' === \substr($token, -2) || '{ }' === \substr($token, -3)) {
            return "";
        }
        if ('@' === $token[0]) {
            if (0 === \strpos($token, '@charset ')) {
                return \strtolower(\strtr($token, "'", '"')); // Force double quote
            }
            if (';' === \substr($token, -1)) {
                return \substr(minify_css(\substr($token, 0, -1) . '{x:x}', $comment, $quote), 0, -5) . ';';
            }

            list($selector, $block) = get_css_rules($token);
            if ('@font-face' === $selector) {
                return $selector . \substr(minify_css('x{' . $block . '}', $comment, $quote), 1);
            }
            $selector = \preg_replace_callback('/((?:[a-z][a-z\d-]*)?)\(\s*((?:' . token_string . '|[^()]|(?R))*)\s*\)/', static function($m) use($comment, $quote) {
                if ("" !== $m[1]) {
                    return minify_css_function($m[0], $quote);
                }
                return '(' . \substr(minify_css('x{' . $m[2] . '}', $comment, $quote), 2, -1) . ')';
            }, $selector);
            return $selector . '{' . minify_css($block, $comment, $quote) . '}';
        }
        if ('}' === \substr($token, -1)) {
            list($selector, $block) = get_css_rules($token);
            $selector = every([
                token_css_comment,
                '\s*' . token_css_selector_function . '\s*',
                '\s*' . token_css_selector_pseudo . '\s*',
                '\s*' . token_css_selector_attr . '\s*',
                '\s*' . token_css_selector_any . '\s*',
                '\s*' . token_css_selector_class . '\s*',
                '\s*' . token_css_selector_id . '\s*',
                '\s*' . token_number . '%\s*', // Frame selector denoted in percent unit for `@keyframes`
                // '\s*' . token_css_selector_element . '\s*',
                token_css_combinator,
                '[,]'
            ], static function($token, $chop) use($comment, $quote) {
                if (':' === $token[0]) {
                    if (')' === \substr($token, -1)) {
                        return \preg_replace_callback('/\(\s*((?:' . token_string . '|[^()]|(?R))*)\s*\)/', static function($m) use($comment, $quote) {
                            // Assume that argument(s) of `:foo()` is a complete CSS selector so we can minify it recursively.
                            // FYI, that `{x:x}` part is a dummy just to make sure that the minifier will not remove the whole rule(s)
                            // since `x{x:x}` is not considered as a selector with empty rule(s).
                            return '(' . \substr(minify_css($m[1] . '{x:x}', $comment, $quote), 0, -5) . ')';
                        }, $chop);
                    }
                    return $chop;
                }
                if ('[' === $token[0] && ']' === \substr($token, -1)) {
                    return \preg_replace_callback('/=(' . token_string . ')(?:\s*([is]))?(?=\])/i', static function($m) use($quote) {
                        $token = \substr($m[1], 1, -1);
                        if ("" === $token) {
                            return '=""';
                        }
                        // <https://mothereff.in/unquoted-attributes>
                        if (1 !== $quote && \ctype_alpha($token[0]) && \preg_match('/^' . token_css_property . '$/i', $token)) {
                            return '=' . $token . (isset($m[2]) ? ' ' . $m[2] : "");
                        }
                        if (false !== \strpos($token, "'")) {
                            return '="' . $token . '"' . ($m[2] ?? "");
                        }
                        return "='" . $token . "'" . ($m[2] ?? "");
                    }, $chop);
                }
                if ('%' === \substr($token, -1)) {
                    return $token;
                }
                return $chop;
            }, $selector);
            $selector = every([
                token_string,
                token_css_combinator,
                '[,]'
            ], static function($token) {
                return $token;
            }, $selector);
            $property = null; // Store current property
            $block = every([
                token_css_comment,
                token_css_function_url,
                token_css_function,
                // Match property
                token_css_hack . '?' . token_css_property . '\s*:\s*'
                // … other must be the value
            ], static function($token) use(&$property, $quote) {
                if (is_token_css_comment($token)) {
                    return $token;
                }
                // `margin:`
                if (':' === \substr($token, -1)) {
                    $property = \trim(\substr($token, 0, -1));
                    return $property . ':';
                }
                $end = ';' === \substr($token, -1) ? ';' : "";
                $token = \rtrim($token, ';'); // Remove semi-colon
                if (
                    'border' === $property ||
                    'border-radius' === $property ||
                    'border-width' === $property ||
                    'outline' === $property
                ) {
                    if ('none' === $token) {
                        return '0' . $end;
                    }
                    return minify_css_values($token . $end, $quote);
                }
                if (
                    'margin' === $property ||
                    'padding' === $property
                ) {
                    $unit = '(' . token_css_number . '|' . token_number . ')';
                    // `1px 0 1px 0`
                    if (\preg_match('/^' . $unit . ' ' . $unit . ' ' . $unit . ' ' . $unit . '$/i', $token, $m)) {
                        $m[1] = minify_css_unit($m[1]);
                        $m[2] = minify_css_unit($m[2]);
                        $m[3] = minify_css_unit($m[3]);
                        $m[4] = minify_css_unit($m[4]);
                        if ($m[1] === $m[3] && $m[2] === $m[4] && $m[1] !== $m[2] && $m[3] !== $m[4]) {
                            // `1px 0`
                            return $m[1] . ' ' . $m[2] . $end;
                        }
                        if ($m[1] === $m[2] && $m[2] === $m[3] && $m[3] === $m[4]) {
                            // `1px`
                            return $m[1] . $end;
                        }
                    }
                    // `1px 0 1px`
                    if (\preg_match('/^' . $unit . ' ' . $unit . ' ' . $unit . '$/i', $token, $m)) {
                        $m[1] = minify_css_unit($m[1]);
                        $m[2] = minify_css_unit($m[2]);
                        $m[3] = minify_css_unit($m[3]);
                        if ($m[1] === $m[3] && $m[1] !== $m[2]) {
                            // `1px 0`
                            return $m[1] . ' ' . $m[2] . $end;
                        }
                        if ($m[1] === $m[2] && $m[2] === $m[3]) {
                            // `1px`
                            return $m[1] . $end;
                        }
                    }
                    // `1px 0`
                    if (\preg_match('/^' . $unit . ' ' . $unit . '$/i', $token, $m)) {
                        $m[1] = minify_css_unit($m[1]);
                        $m[2] = minify_css_unit($m[2]);
                        if ($m[1] === $m[2]) {
                            // `1px`
                            return $m[1] . $end;
                        }
                    }
                    // `1px`
                    if (\preg_match('/^' . $unit . '$/i', $token, $m)) {
                        $m[1] = minify_css_unit($m[1]);
                        return $m[1] . $end;
                    }
                    return minify_css_values($token . $end, $quote);
                }
                if ('font-weight' === $property) {
                    return (['bold' => '700', 'normal' => '400'][$token] ?? $token) . $end;
                }
                // No space, this must be a keyword!
                if ("" !== $token && false === \strpos($token, ' ')) {
                    if (is_token_css_hex($token) || isset(tokens_css_color_name[$token])) {
                        return minify_css_color($token) . $end;
                    }
                }
                $token .= $end; // Restore semi-colon
                // Other(s)
                return minify_css_values($token, $quote);
            }, $block);
            // Miscellaneous…
            $block = \preg_replace_callback('/(?:' . \strtr(token_css_comment, ['/' => "\\/"]) . '|' . token_string . '|\s*[:;,]\s*)/', static function($m) {
                if (is_token_css_comment($m[0]) || is_token_string($m[0])) {
                    return $m[0];
                }
                return \trim($m[0]);
            }, \trim(\strtr($block, ['  ' => ' '])));
            return $selector . '{' . $block . '}';
        }
        return $token;
    }, $out);
    return $out;
}

function minify_html_content($token, $tag, $fn, int $quote = 2) {
    return \preg_replace_callback('/^(\s*)<' . $tag . '(\s(?:' . token_string . '|[^>])*)?>([\s\S]*?)<\/' . $tag . '>(\s*)$/i', static function($m) use($fn, $quote, $tag) {
        return $m[1] . minify_html_element('<' . $tag . $m[2] . '>', $quote) . \call_user_func($fn, $m[3]) . '</' . $tag . '>' . $m[4];
    }, $token);
}

function minify_html_element($token, int $quote = 2) {
    $m = get_html_name($token);
    $m[0] = \trim($m[0]);
    $m[1] = \trim($m[1]);
    $m[1] = every([
        token_string,
        '\s' . token_html_name
    ], static function($token, $chop) use($quote) {
        if (is_token_string($token)) {
            if (1 !== $quote) {
                $v = \trim($token, '\'"');
                return \preg_match('/^' . token_html_name . '$/', $v) ? $v : $token;
            }
            return $token;
        }
        $chop = \preg_replace('/\s+/', ' ', $chop);
        return \strtr($chop, [
            ' ?' => '?',
            ' /' => '/'
        ]);
    }, $m[1]);
    return '<' . $m[0] . ("" !== $m[1] ? ' ' . $m[1] : "") . '>';
}

function minify_html(string $in, int $comment = 2, int $quote = 1) {
    if ("" === ($in = \trim($in))) {
        return "";
    }
    $out = every([token_html_comment], static function($token) use($comment) {
        if (1 === $comment) {
            return $token;
        }
        if (is_token_html_comment($token)) {
            if (2 === $comment) {
                if ('<![endif]-->' === \substr($token, -12)) {
                    return $comment; // Keep legacy IE comment(s)
                }
                if (
                    // Detect license comment(s) from the content phrase.
                    // It should contains character(s) like `@license`
                    false !== \strpos($token, '@licence') || // noun
                    false !== \strpos($token, '@license') || // verb
                    false !== \strpos($token, '@preserve')
                ) {
                    $token = \substr($token, 4, -3);
                    return '<!--' . \trim(\strtr($token, ['@preserve' => ""])) . '-->';
                }
            }
            return ""; // Remove!
        }
        return $token;
    }, $in);
    $out = every([
        '\s*' . token_html_comment . '\s*',
        '\s*' . token_html_dtd . '\s*',
        '\s*' . token_html_pi . '\s*',
        '\s*' . token_html_element_skip . '\s*',
        '\s*' . token_html_element_end . '\s*',
        '\s*' . token_html_element_start . '\s*',
        '\s*' . token_html_entity . '\s*'
    ], static function($token, $chop) use($comment, $quote) {
        if (is_token_html_comment($token)) {
            return $token; // Keep!
        }
        if (is_token_html_entity($token)) {
            return \preg_replace_callback('/(?:' . token_html_entity . '|\s+)/i', static function($m) {
                if (is_token_html_entity($m[0])) {
                    $v = \html_entity_decode($m[0]);
                    return '&' !== $v && '<' !== $v && '>' !== $v ? $v : $m[0];
                }
                return ' ';
            }, $chop);
        }
        if ('</pre>' === \substr($token, -6)) {
            return \preg_replace_callback('/' . token_html_element_start . '/', static function($m) use($quote) {
                return minify_html_element($m[0], $quote);
            }, $token);
        }
        if ('</textarea>' === \substr($token, -11)) {
            return \preg_replace_callback('/' . token_html_element_start . '/', static function($m) use($quote) {
                return minify_html_element($m[0], $quote);
            }, $token);
        }
        if ('</script>' === \substr($token, -9)) {
            return minify_html_content($token, 'script', static function($v) use($comment, $quote, $token) {
                if ($m = get_html_name($token)) {
                    if (false !== \strpos($m[1], 'type=') && \preg_match('/\btype=([\'"]?)application\/(?:ld\+)?json\1/i', $m[1])) {
                        return minify_json($v, $comment, $quote);
                    }
                }
                return minify_js($v, $comment, $quote);
            }, $quote);
        }
        if ('</style>' === \substr($token, -8)) {
            return minify_html_content($token, 'style', static function($v) use($comment, $quote) {
                return minify_css($v, $comment, $quote);
            }, $quote);
        }
        if (is_token_element($token)) {
            if ('</code>' === \substr($token, -7)) {
                $chop = minify_html_content($chop, 'code', static function($v) use($comment, $quote) {
                    return minify_html($v, $comment, $quote);
                }, $quote);
            } else {
                if ('</' === \substr($token, 0, 2)) {
                    $chop = \ltrim($chop);
                } else if ('/>' !== \substr($token, -2)) {
                    if (false === \strpos(',img,input,', ',' . get_html_name($token)[0] . ',')) {
                        $chop = \rtrim($chop);
                    }
                }
            }
            if (' <' === \substr($chop, 0, 2) || '> ' === \substr($chop, -2)) {
                return \preg_replace_callback('/<' . token_html_name . '(?:\s(?:' . token_string . '|[^>])*)?>/', static function($m) use($quote) {
                    return minify_html_element($m[0], $quote);
                }, $chop);
            }
            return minify_html_element($token, $quote);
        }
        return \preg_replace('/\s+/', ' ', $token);
    }, $out);
    return $out;
}

function minify_js(string $in, int $comment = 2, int $quote = 2) {
    if ("" === ($in = \trim($in))) {
        return "";
    }
    $out = every([
        token_js_comment,
        token_js_comment_2,
        token_string,
        token_js_string,
        token_js_pattern
    ], static function($token) use($comment, $quote) {
        if (is_token_js_comment($token)) {
            if (1 === $comment) {
                if (0 === \strpos($token, '//')) {
                    return '/*' . \trim(\substr($token, 2)) . '*/';
                }
                return $token;
            }
            if (2 === $comment) {
                if (
                    // Detect special comment(s) from the third character.
                    // Should be an `!` or `*` → `/*! asdf */` or `/** asdf */`
                    isset($token[2]) && false !== \strpos('!*', $token[2]) ||
                    // Detect license comment(s) from the content phrase.
                    // It should contains character(s) like `@license`
                    false !== \strpos($token, '@licence') || // noun
                    false !== \strpos($token, '@license') || // verb
                    false !== \strpos($token, '@preserve')
                ) {
                    $token = \ltrim(\substr($token, 2, -2), '!*');
                    $token = \preg_replace('/@preserve\s*/', "", $token);
                    return '/*' . \trim($token) . '*/';
                }
            }
            return ""; // Remove!
        }
        return $token;
    }, $in);
    $out = every([
        token_js_comment,
        token_js_comment_2,
        token_string,
        token_js_string,
        token_js_pattern,
        token_boolean,
        token_number,
        '\b(?:case|return|typeof|void)\s*(?=[-.\d])',
        '[%&()*+,\-/:;<=>?\[\]^{|}]'
    ], static function($token, $chop) use($comment, $quote) {
        if (is_token_js_comment($token) || is_token_js_pattern($token) || is_token_js_string($token)) {
            if ('`' === $token[0] && false !== \strpos($token, '${')) {
                return \preg_replace_callback('/\$\{\s*((?:' . token_string . '|[^{}]|(?R))*)\s*\}/', static function($m) use($comment, $quote) {
                    return '${' . minify_js($m[1], $comment, $quote) . '}';
                }, $token);
            }
            return $token;
        }
        $token = \preg_replace('/\s+/', ' ', $token);
        if (is_token_boolean($token)) {
            return ['false' => '!1', 'true' => '!0'][$token] ?? $token;
        }
        if (is_token_number($token)) {
            $token = minify_number($token);
            $e = minify_number_long($token);
            return \strlen($e) < \strlen($token) ? \strtolower($e) : $token;
        }
        if (
            'case ' === $chop ||
            'return ' === $chop ||
            'typeof ' === $chop ||
            'void ' === $chop
        ) {
            return $chop;
        }
        return $token;
    }, $out);
    $out = every([
        token_js_comment,
        token_js_comment_2,
        token_js_pattern,
        '(?:(?:' . token_js_name . ')|[\]])(?:\[(?:"' . token_js_name . '"|\'' . token_js_name . '\'|`' . token_js_name . '`)\])+',
        '(?<=[\s{,])(?:"' . token_js_name . '"|\'' . token_js_name . '\'|`' . token_js_name . '`)\s*:',
        token_string,
        token_js_string,
        '\(\s*' . token_js_name . '\s*\)\s*=>'
    ], static function($token, $chop) use($quote) {
        if (is_token_js_comment($token) || is_token_js_pattern($token) || is_token_js_string($token)) {
            return $token;
        }
        if ('=>' === \substr($token, -2)) {
            return \trim(\substr(\trim(\substr($token, 1, -2)), 0, -1)) . '=>';
        }
        if (1 !== $quote) {
            if (('"' === $token[0] || "'" === $token[0]) && ':' === \substr($token, -1)) {
                return \trim(\trim(\substr($token, 0, -1)), '\'"') . ':';
            }
            if (']' === \substr($token, -1) && \preg_match('/^(?:(?:' . token_js_name . ')|[\]])\[/', $token)) {
                return \strtr($token, [
                    "']" => "",
                    "['" => '.',
                    '"]' => "",
                    '["' => '.'
                ]);
            }
        }
        return \strtr($token, [
            ',]' => ']',
            ',}' => '}',
            ';}' => '}'
        ]);
    }, $out);
    return $out;
}

function minify_json(string $in, int $comment = 2, int $quote = 1) {
    return \json_encode(\json_decode($in), \JSON_UNESCAPED_SLASHES | \JSON_UNESCAPED_UNICODE);
}

// Based on <https://php.net/manual/en/function.php-strip-whitespace.php#82437>
function minify_php(string $in, int $comment = 2, int $quote = 1) {
    $out = "";
    $t = [];
    // White-space(s) around these token(s) can be removed :)
    foreach ([
        'AND_EQUAL',
        'ARRAY_CAST',
        'BOOLEAN_AND',
        'BOOLEAN_OR',
        'BOOL_CAST',
        'COALESCE',
        'CONCAT_EQUAL',
        'DEC',
        'DIV_EQUAL',
        'DOLLAR_OPEN_CURLY_BRACES',
        'DOUBLE_ARROW',
        'DOUBLE_CAST',
        'DOUBLE_COLON',
        'INC',
        'INT_CAST',
        'IS_EQUAL',
        'IS_GREATER_OR_EQUAL',
        'IS_IDENTICAL',
        'IS_NOT_EQUAL',
        'IS_NOT_IDENTICAL',
        'IS_SMALLER_OR_EQUAL',
        'MINUS_EQUAL',
        'MOD_EQUAL',
        'MUL_EQUAL',
        'OBJECT_OPERATOR',
        'OR_EQUAL',
        'PAAMAYIM_NEKUDOTAYIM',
        'PLUS_EQUAL',
        'POW',
        'POW_EQUAL',
        'SL',
        'SL_EQUAL',
        'SPACESHIP',
        'SR',
        'SR_EQUAL',
        'STRING_CAST',
        'XOR_EQUAL'
    ] as $v) {
        if (\defined($v = "\\T_" . $v)) {
            $t[\constant($v)] = 1;
        }
    }
    $c = \count($toks = \token_get_all($in));
    $doc = $skip = false;
    $start = $end = null;
    for ($i = 0; $i < $c; ++$i) {
        $tok = $toks[$i];
        if (\is_array($tok)) {
            $id = $tok[0];
            $token = $tok[1];
            if (\T_INLINE_HTML === $id) {
                $out .= $token;
                $skip = false;
            } else {
                if (\T_OPEN_TAG === $id) {
                    $out .= \rtrim($token) . ' ';
                    $start = \T_OPEN_TAG;
                    $skip = true;
                } else if (\T_OPEN_TAG_WITH_ECHO === $id) {
                    $out .= $token;
                    $start = \T_OPEN_TAG_WITH_ECHO;
                    $skip = true;
                } else if (\T_CLOSE_TAG === $id) {
                    if (\T_OPEN_TAG_WITH_ECHO === $start) {
                        $out = \rtrim($out, '; ');
                    } else {
                        $token = ' ' . $token;
                    }
                    $out .= \trim($token);
                    $start = null;
                    $skip = false;
                } else if (isset($t[$id])) {
                    $out .= $token;
                    $skip = true;
                } else if (\T_ENCAPSED_AND_WHITESPACE === $id || \T_CONSTANT_ENCAPSED_STRING === $id) {
                    if ('"' === $token[0]) {
                        $token = \addcslashes($token, "\n\r\t");
                    }
                    $out .= $token;
                    $skip = true;
                } else if (\T_WHITESPACE === $id) {
                    $n = $toks[$i + 1] ?? null;
                    if(!$skip && (!\is_string($n) || '$' === $n) && !isset($t[$n[0]])) {
                        $out .= ' ';
                    }
                    $skip = false;
                } else if (\T_START_HEREDOC === $id) {
                    $out .= "<<<S\n";
                    $skip = false;
                    $doc = true; // Enter HEREDOC
                } else if (\T_END_HEREDOC === $id) {
                    $out .= "S\n";
                    $skip = true;
                    $doc = false; // Exit HEREDOC
                    for ($j = $i + 1; $j < $c; ++$j) {
                        if (\is_string($v = $toks[$j])) {
                            $out .= $v;
                            if (';' === $v || ',' === $v) {
                                if ("\nS\n" . $v === \substr($out, -4)) {
                                    $out = \rtrim($out, "\n" . $v) . $v;
                                    if (';' === $v) {
                                        // Prior to PHP 7.3.0, it is very important to note that the line with the closing identifier must
                                        // contain no other characters, except a semicolon (`;`). That means especially that the identifier
                                        // may not be indented, and there may not be any spaces or tabs before or after the semicolon.
                                        // It's also important to realize that the first character before the closing identifier must be a
                                        // newline as defined by the local operating system. This is `\n` on UNIX systems, including macOS.
                                        // The closing delimiter must also be followed by a newline.
                                        //
                                        // <https://www.php.net/manual/en/language.types.string.php#language.types.string.syntax.heredoc>
                                        $out .= "\n";
                                    }
                                }
                                $i = $j;
                                break;
                            }
                        } else if (\T_CLOSE_TAG === $v[0]) {
                            break;
                        } else {
                            $out .= \trim($v[1]);
                        }
                    }
                } else if (\T_COMMENT === $id || \T_DOC_COMMENT === $id) {
                    if (
                        1 === $comment || (
                            2 === $comment && (
                                // Detect special comment(s) from the third character
                                // It should be a `!` or `*` → `/*! keep */` or `/** keep */`
                                !empty($token[2]) && false !== \strpos('!*', $token[2]) ||
                                // Detect license comment(s) from the content
                                // It should contains character(s) like `@license`
                                false !== \strpos($token, '@licence') || // noun
                                false !== \strpos($token, '@license') || // verb
                                false !== \strpos($token, '@preserve')
                            )
                        )
                    ) {
                        $token = \ltrim(\substr($token, 2, -2), '!*');
                        $out .= '/*' . \trim(\strtr($token, ['@preserve' => ""])) . '*/';
                    }
                    $skip = true;
                } else {
                    $out .= $token;
                    $skip = false;
                }
            }
            $end = "";
        } else {
            if (false === \strpos(';:', $tok) || $end !== $tok) {
                $out .= $tok;
                $end = $tok;
            }
            $skip = true;
        }
    }
    $out = every([
        '\s*' . token_string . '\s*',
        '\s*<\?php echo ',
        ';\?>\s*'
    ], static function($token, $chop) {
        if (is_token_string($token)) {
            return $chop;
        }
        return \strtr($chop, [
            '<?php echo ' => '<?=',
            ';?>' => '?>'
        ]);
    }, $out);
    return $out;
}

} // end namespace

namespace {
    function minify_css(...$lot) {
        return \x\minify\_\minify_css(...$lot);
    }
    function minify_html(...$lot) {
        return \x\minify\_\minify_html(...$lot);
    }
    function minify_js(...$lot) {
        return \x\minify\_\minify_js(...$lot);
    }
    function minify_json(...$lot) {
        return \x\minify\_\minify_json(...$lot);
    }
    function minify_php(...$lot) {
        return \x\minify\_\minify_php(...$lot);
    }
}