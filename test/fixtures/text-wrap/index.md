# Text Wrap

HTML is a insensitive to whitespace, whereas Markdown *is* sensitive.
In some Markdown elements, it’s not possible to include line breaks (whether CR,
LF, or CR+LF).
To handle this, we need to remove them in certain scenario’s: headings and table
cells.

Line breaks can be created in several ways, such as `br` elements:

break\
in h1
=====

break\
in h2
-----

### break in h3

#### break in h4

##### break in h5

###### break in h6

| Heading cell |
| ------------ |
| Data cell    |

In `newlines: true` mode, line feeds such as this one:
would normally also produce an line feed:

break
in h1
=====

break
in h2
-----

### break&#xA;in h3

#### break&#xA;in h4

##### break&#xA;in h5

###### break&#xA;in h6

| Heading&#xA;cell |
| ---------------- |
| Data&#xA;cell    |
