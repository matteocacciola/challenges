<?php

namespace DataMat;

use PHPUnit\Framework\TestCase;

final class PathTest extends TestCase
{
    /**
     * @dataProvider getDataSimplePaths
     */
    public function testSimplePaths(string $initialPath, string $newPath, string $expected) : void
    {
        $path = new Path($initialPath);

        $this->assertSame($expected, $path->cd($newPath)->currentPath);
    }

    /**
     * @dataProvider getDataComplexPaths
     */
    public function testComplexPaths(string $initialPath, string $newPath, string $expected) : void
    {
        $path = new Path($initialPath);

        $this->assertSame($expected, $path->cd($newPath)->currentPath);
    }

    public function getDataSimplePaths() : array
    {
        return [
            ['/a/b/c/d', '../x', '/a/b/c/x'],
            ['/a/b/c/d', './x/y', '/a/b/c/d/x/y'],
            ['/a/b/c/d', './x/./y', '/a/b/c/d/x/y'],
            ['/a/b/c/d', './../../../', '/a'],
        ];
    }

    public function getDataComplexPaths() : array
    {
        return [
            ['a/b/c/d', '.././../../x/./y', 'a/x/y'],
            ['/a/b/c/d', '././../d/x/../x/y', '/a/b/c/d/x/y'],
            ['a/b/c/d', '././../d/x/../x/y', 'a/b/c/d/x/y'],
            ['a/b/c/d', '././../d/../x/../x/y', 'a/b/c/x/y'],
        ];
    }
}