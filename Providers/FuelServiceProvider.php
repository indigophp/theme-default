<?php

/*
 * This file is part of the FuelPHP Menu package.
 *
 * (c) Indigo Development Team
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Indigo\Theme\Indigo\Providers;

use Fuel\Dependency\ServiceProvider;

/**
 * Provides twig services
 *
 * @author Márk Sági-Kazár <mark.sagikazar@gmail.com>
 */
class FuelServiceProvider extends ServiceProvider
{
	/**
	 * {@inheritdoc}
	 */
	public $provides = true;

	/**
	 * {@inheritdoc}
	 */
	public function provide()
	{
		// menu extension
		$this->register('twig.menu', function($dic)
		{
			$rendererProvider = $dic->resolve('menu.renderer_provider');
			$menuProvider = $dic->resolve('menu.provider');

			$helper = $dic->resolve('Knp\\Menu\\Twig\\Helper', [$rendererProvider, $menuProvider]);

			return $dic->resolve('Knp\\Menu\\Twig\\MenuExtension', [$helper]);
		});

		$this->extend('menu.renderer.fuel', function($dic, $instance)
		{
			$instance->setDefaultTemplate('knp_menu.html.twig');

			return $instance;
		});
	}
}
